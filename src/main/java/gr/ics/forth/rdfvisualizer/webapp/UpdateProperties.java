/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gr.ics.forth.rdfvisualizer.webapp;

import info.aduna.app.config.Configuration;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;


/**
 *
 * @author cpetrakis
 */
public class UpdateProperties extends HttpServlet {

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
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            
            /*String filepath = request.getParameter("filepath");
            String tree_depth = request.getParameter("tree_depth");
            String username = request.getParameter("db_username");
            String password = request.getParameter("db_password");
            String port = request.getParameter("db_port");
            String db_url = request.getParameter("db_url");*/
            
            String pred_labels = request.getParameter("pred_labels");
            String prefered_preds = request.getParameter("prefered_preds");
                                          
           
           ArrayList<String> predicate_Array = new ArrayList<String>();
           JSONArray jsonArray = new JSONArray(pred_labels);
           
           ArrayList<String> prefered_Array = new ArrayList<String>();
           JSONArray jsonArray0 = new JSONArray(prefered_preds);
           
           

                for (int i = 0; i < jsonArray.length()-1; i++) {
                    predicate_Array.add(jsonArray.getString(i));
                    prefered_Array.add(jsonArray0.getString(i));
                }
                
                //System.out.println(predicate_Array.get(3));
        
       
      
            
            
            
FileInputStream in = new FileInputStream("C:\\Users\\cpetrakis\\Desktop\\netbeansPrjct\\RDFVisualizer-webapp\\src\\main\\resources\\test.properties");
Properties props = new Properties();
props.load(in);
in.close();

            
GetConfigProperties app = new GetConfigProperties();
props = app.getConfig("test.properties");

FileOutputStream outp = new FileOutputStream("C:\\Users\\cpetrakis\\Desktop\\netbeansPrjct\\RDFVisualizer-webapp\\src\\main\\resources\\test.properties");

        for(int i=0; i<predicate_Array.size(); i++){
            System.out.println(predicate_Array.get(i));
            props.setProperty(predicate_Array.get(i), prefered_Array.get(i) );
        }

props.store(outp, "#########   Properties ");
outp.close();

            
     
        //    out.println(filepath);
            
        }
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
        processRequest(request, response);
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
