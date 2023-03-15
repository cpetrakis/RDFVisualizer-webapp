/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gr.ics.forth.rdfvisualizer.webapp;


import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.regex.Pattern;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Properties;

/**
 *
 * @author samarita
 */
public class FileUploadServlet extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        System.out.println(request.getHeader("Content-Type"));
        String range = request.getHeader("Content-Range");
        System.out.println("RANGE is:" + range);
        long fileFullLength = -1;
        long chunkFrom = -1;
        long chunkTo = -1;
        if (range != null) {
            if (!range.startsWith("bytes ")) {
                throw new ServletException("Unexpected range format: " + range);
            }
            String[] fromToAndLength = range.substring(6).split(Pattern.quote("/"));
            fileFullLength = Long.parseLong(fromToAndLength[1]);
            String[] fromAndTo = fromToAndLength[0].split(Pattern.quote("-"));
            chunkFrom = Long.parseLong(fromAndTo[0]);
            chunkTo = Long.parseLong(fromAndTo[1]);
        }
        //File tempDir = new File(System.getProperty("java.io.tmpdir"));  // Configure according
        //File tempDir = new File(System.getProperty("java.io.tmpdir"));  // Configure according
       
        GetConfigProperties app = new GetConfigProperties();
        Properties props = app.getConfig("config.properties");

        String defaultfolder = props.getProperty("default_folder").trim();
        File tempDir = new File(defaultfolder);  
        // System.out.println(tempDir);
        
        File storageDir = tempDir;                                      // project server environment.
        String uploadId = null;
        FileItemFactory factory = new DiskFileItemFactory(10000000, tempDir);
        ServletFileUpload upload = new ServletFileUpload(factory);
        try {
            List<?> items = upload.parseRequest(request);
            Iterator<?> it = items.iterator();
            List<Map<String, Object>> ret = new ArrayList<Map<String, Object>>();
            while (it.hasNext()) {
                FileItem item = (FileItem) it.next();
                if (item.isFormField()) {
                    if (item.getFieldName().equals("uploadId")) {
//                        uploadId = item.getString();
                        uploadId = "";
                    }
                } else {
                    Map<String, Object> fileInfo = new LinkedHashMap<String, Object>();
                    File assembledFile = null;
                    fileInfo.put("name", item.getName());
                    fileInfo.put("type", item.getContentType());
                    File dir = new File(storageDir, uploadId);
                    if (!dir.exists()) {
                        dir.mkdir();
                    }
                    if (fileFullLength < 0) {  // File is not chunked
                        fileInfo.put("size", item.getSize());
                        assembledFile = new File(dir, item.getName());
                        item.write(assembledFile);
                    } else {  // File is chunked
                        byte[] bytes = item.get();
                        if (chunkFrom + bytes.length != chunkTo + 1) {
                            throw new ServletException("Unexpected length of chunk: " + bytes.length
                                    + " != " + (chunkTo + 1) + " - " + chunkFrom);
                        }
                        saveChunk(dir, item.getName(), chunkFrom, bytes, fileFullLength);
                        TreeMap<Long, Long> chunkStartsToLengths = getChunkStartsToLengths(dir, item.getName());
                        long lengthSoFar = getCommonLength(chunkStartsToLengths);
                        fileInfo.put("size", lengthSoFar);
                        if (lengthSoFar == fileFullLength) {
                            assembledFile = assembleAndDeleteChunks(dir, item.getName(),
                                    new ArrayList<Long>(chunkStartsToLengths.keySet()));
                        }
                    }
                    if (assembledFile != null) {
                        fileInfo.put("complete", true);
                        fileInfo.put("serverPath", assembledFile.getAbsolutePath());
                        // Here you can do something with fully assembled file.
                    }
                    ret.add(fileInfo);
                }
            }
            Map<String, Object> filesInfo = new LinkedHashMap<String, Object>();
            filesInfo.put("files", ret);
            response.setContentType("application/json");
            response.getWriter().write(new ObjectMapper().writeValueAsString(filesInfo));
            response.getWriter().close();
        } catch (ServletException ex) {
            throw ex;
        } catch (Exception ex) {
            ex.printStackTrace();
            throw new ServletException(ex);
        }
    }

    private static void saveChunk(File dir, String fileName,
            long from, byte[] bytes, long fileFullLength) throws IOException {
        File target = new File(dir, fileName + "." + from + ".chunk");
        OutputStream os = new FileOutputStream(target);
        try {
            os.write(bytes);
        } finally {
            os.close();
        }
    }

    private static TreeMap<Long, Long> getChunkStartsToLengths(File dir,
            String fileName) throws IOException {
        TreeMap<Long, Long> chunkStartsToLengths = new TreeMap<Long, Long>();
        for (File f : dir.listFiles()) {
            String chunkFileName = f.getName();
            if (chunkFileName.startsWith(fileName + ".")
                    && chunkFileName.endsWith(".chunk")) {
                chunkStartsToLengths.put(Long.parseLong(chunkFileName.substring(
                        fileName.length() + 1, chunkFileName.length() - 6)), f.length());
            }
        }
        return chunkStartsToLengths;
    }

    private static long getCommonLength(TreeMap<Long, Long> chunkStartsToLengths) {
        long ret = 0;
        for (long len : chunkStartsToLengths.values()) {
            ret += len;
        }
        return ret;
    }

    private static File assembleAndDeleteChunks(File dir, String fileName,
            List<Long> chunkStarts) throws IOException {
        File assembledFile = new File(dir, fileName);
        if (assembledFile.exists()) // In case chunks come in concurrent way
        {
            return assembledFile;
        }
        OutputStream assembledOs = new FileOutputStream(assembledFile);
        byte[] buf = new byte[100000];
        try {
            for (long chunkFrom : chunkStarts) {
                File chunkFile = new File(dir, fileName + "." + chunkFrom + ".chunk");
                InputStream is = new FileInputStream(chunkFile);
                try {
                    while (true) {
                        int r = is.read(buf);
                        if (r == -1) {
                            break;
                        }
                        if (r > 0) {
                            assembledOs.write(buf, 0, r);
                        }
                    }
                } finally {
                    is.close();
                }
                chunkFile.delete();
            }
        } finally {
            assembledOs.close();
        }
        return assembledFile;
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
       // System.out.println("GET");
      //  System.out.println(request.getParameter("file"));

        TreeMap<Long, Long> chunkStartsToLengths = getChunkStartsToLengths(new File(System.getProperty("java.io.tmpdir")), request.getParameter("file"));
        long lengthSoFar = getCommonLength(chunkStartsToLengths);

        Map<String, Object> filesInfo = new LinkedHashMap<String, Object>();
        filesInfo.put("uploadedBytes", lengthSoFar);
        filesInfo.put("file", request.getParameter("file"));
    

        response.setContentType("application/json");
        response.getWriter().write(new ObjectMapper().writeValueAsString(filesInfo));
        response.getWriter().close();

//        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        System.out.println("POST");

        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>
}
