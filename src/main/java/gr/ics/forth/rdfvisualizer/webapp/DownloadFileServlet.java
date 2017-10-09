/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gr.ics.forth.rdfvisualizer.webapp;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.net.URL;
import java.net.URLConnection;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author cpetrakis
 */

public class DownloadFileServlet extends HttpServlet {

 
    protected void doGet(HttpServletRequest request,
         HttpServletResponse response) throws ServletException, IOException {
        // reads input file from an absolute path
       /* String filePath = (String) request.getParameter("ftp_path");
        String mtype = (String) request.getParameter("mtype");
        String filename =  (String) request.getParameter("filename");*/
        //filePath ="ftp://readonly:readonly@139.91.183.41/repository/2014/05/19/uuid221c71a6-2060-4e75-bdc5-4c1773b97971";
        
        String mtype = (String) request.getParameter("mtype");
       // String filep = (String) request.getParameter("file");
      //  String typos = (String) request.getParameter("typos");
        String filePath = "";
        String filename =  "";
        
       
            filePath = "file:///C:/Users/cpetrakis/Desktop/netbeansPrjct/RDFVisualizer-webapp/src/main/resources/properties.xml";
            filename =  "properties.xml";
                                    
        BufferedInputStream in = null; 
        try {
            
            URL url = new URL(filePath); 
            URLConnection con = url.openConnection();
            in = new BufferedInputStream(con.getInputStream());
            
            if (mtype == null){
                mtype = "application/octet-stream";
            }
            response.setContentType(mtype); 
            response.setHeader("Content-Disposition", " attachment; filename=" + filename);
            ServletOutputStream out = response.getOutputStream(); 
            
            byte[] buffer = new byte[4 * 1024];  
            int data;  
            
            while((data = in.read(buffer)) != -1){
                out.write(buffer, 0, data);  
            }             
            out.flush();   
        }
        catch (Exception e){         
            System.out.println(e.getMessage());
        }
  
    }
}