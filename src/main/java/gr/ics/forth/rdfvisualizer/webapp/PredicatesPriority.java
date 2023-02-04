/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gr.ics.forth.rdfvisualizer.webapp;

import com.google.gson.Gson;
import api.core.properties.XSTREAMpropertyReader;
import api.core.utils.IntPair;
import api.core.utils.Prioritise;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;

/**
 *
 * @author cpetrakis
 * 
 */
public class PredicatesPriority extends HttpServlet {

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

            String subject_type = request.getParameter("subject_type");
            String preds = request.getParameter("preds");
          
            if (subject_type != null) {

                ArrayList<String> predicate_Array = new ArrayList<String>();
                JSONArray jsonArray = new JSONArray(preds);

                for (int i = 0; i < jsonArray.length(); i++) {
                    predicate_Array.add(jsonArray.getString(i));
                }

                Map<String, List<IntPair>> priorities = new HashMap<String, List<IntPair>>();

                GetConfigProperties app = new GetConfigProperties();
                Properties props = app.getConfig("config.properties");
                String properties_xml = props.getProperty("priorities_xml").trim();
                
                XSTREAMpropertyReader xreader = new XSTREAMpropertyReader();
                priorities = xreader.returnPriorities(properties_xml);                

                Prioritise pr = new Prioritise();
                Map<String, List<IntPair>> prioritiesSorted = new HashMap<String, List<IntPair>>();
                prioritiesSorted = pr.prioritiseProperties(priorities);
                                

                ArrayList<String> final_Array = new ArrayList<String>();

                if ((prioritiesSorted.get(subject_type)) != null) {

                    for (int i = 0; i < ((prioritiesSorted.get(subject_type)).size()); i++) {
                        if (predicate_Array.contains(((prioritiesSorted.get(subject_type)).get(i)).getPairKey())) {
                            final_Array.add(((prioritiesSorted.get(subject_type)).get(i)).getPairKey());
                            predicate_Array.remove(((prioritiesSorted.get(subject_type)).get(i)).getPairKey());
                        }
                    }

                    for (String predicate_Array1 : predicate_Array) {
                        final_Array.add(predicate_Array1);
                    }

                    Gson gson = new Gson();
                    String json = gson.toJson(final_Array);
                    out.println(json);                    
                    
                } else {                   
                    out.println(-1);
                }
            } else {
                out.println(-1);
            }

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
