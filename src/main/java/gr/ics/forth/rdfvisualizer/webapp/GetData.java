/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gr.ics.forth.rdfvisualizer.webapp;

import api.core.impl.BlazeGraphManager;
import api.core.impl.RDFfileManager;
import api.core.impl.TripleStoreManager;
import api.core.utils.Triple;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.TreeSet;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.eclipse.jetty.client.HttpClient;
import org.openrdf.query.MalformedQueryException;
import org.openrdf.query.QueryEvaluationException;
import org.openrdf.repository.RepositoryException;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author cpetrakis
 */
public class GetData extends HttpServlet {

    /**
     * ************************ Create Json File *****************************
     * @param outgoingLinks
     * @param subjectLabel
     * @param subjectType
     * @param subject
     * @return
     * @throws org.openrdf.repository.RepositoryException
     * @throws org.openrdf.query.MalformedQueryException
     * @throws org.openrdf.query.QueryEvaluationException
     */
    public static JSONObject createJsonFile(Map<Triple, List<Triple>> outgoingLinks, String subjectLabel, String subjectType, String subject)
            throws RepositoryException, MalformedQueryException, QueryEvaluationException {

        Iterator<Map.Entry<Triple, List<Triple>>> iter = outgoingLinks.entrySet().iterator();

        JSONObject subjectlist = new JSONObject();
        subjectlist.put("type", subjectType);
        subjectlist.put("label", subjectLabel);
        subjectlist.put("subject", subject);

        JSONObject result = new JSONObject();
        JSONArray objects = new JSONArray();

        GetConfigProperties pred_app = new GetConfigProperties();
        Properties pred_props = pred_app.getConfig("predicates.properties");

        while (iter.hasNext()) {

            Map.Entry<Triple, List<Triple>> entry = iter.next();
            List<Triple> l = new ArrayList<Triple>();

            l = entry.getValue();

            for (int i = 0; i < l.size(); i++) {

                JSONObject object = new JSONObject();
                String propval = pred_props.getProperty((entry.getKey().getLabel()).replaceAll(" ", "_"));

                if ((propval == null) || propval.equals("")) {
                    object.put("predicate", entry.getKey().getLabel());
                } else {
                    object.put("predicate", pred_props.getProperty((entry.getKey().getLabel()).replaceAll(" ", "_")));
                }
                object.put("predicate_uri", entry.getKey().getSubject());
                object.put("predicate_type", entry.getKey().getType());
                object.put("label", entry.getValue().get(i).getLabel());
                object.put("uri", entry.getValue().get(i).getSubject());
                object.put("type", entry.getValue().get(i).getType());
                objects.put(object);
            }
            result.put("Objects", objects);
        }

        result.put("Subject", subjectlist);
        return result;
    }
    
    /**
     * ************************ Create Inverse properties Json File *****************************
     * @param outgoingLinks
     * @param subjectLabel
     * @param subjectType
     * @param subject
     * @return
     * @throws org.openrdf.repository.RepositoryException
     * @throws org.openrdf.query.MalformedQueryException
     * @throws org.openrdf.query.QueryEvaluationException
     */

    public static JSONObject createInvertJsonFile(Map<Triple, List<Triple>> outgoingLinks, String subjectLabel, String subjectType, String subject)
            throws RepositoryException, MalformedQueryException, QueryEvaluationException {

        Iterator<Map.Entry<Triple, List<Triple>>> iter = outgoingLinks.entrySet().iterator();

        JSONObject subjectlist = new JSONObject();
        subjectlist.put("type", subjectType);
        subjectlist.put("label", subjectLabel);
        subjectlist.put("subject", subject);

        JSONObject result = new JSONObject();
        JSONArray objects = new JSONArray();

        GetConfigProperties pred_app = new GetConfigProperties();
        Properties pred_props = pred_app.getConfig("predicates.properties");

        while (iter.hasNext()) {

            Map.Entry<Triple, List<Triple>> entry = iter.next();

            List<Triple> l = new ArrayList<Triple>();

            l = entry.getValue();

            for (int i = 0; i < l.size(); i++) {

                JSONObject object = new JSONObject();
                String propval = pred_props.getProperty((entry.getKey().getLabel()).replaceAll(" ", "_"));

                if ((propval == null) || propval.equals("")) {
                    object.put("predicate", entry.getKey().getLabel());
                } else {
                    object.put("predicate", pred_props.getProperty((entry.getKey().getLabel()).replaceAll(" ", "_")));
                }
                object.put("predicate_uri", entry.getKey().getSubject());
                object.put("predicate_type", entry.getKey().getType());
                object.put("label", entry.getValue().get(i).getLabel());
                object.put("uri", entry.getValue().get(i).getSubject());
                object.put("type", entry.getValue().get(i).getType());
                object.put("invert", true);
                objects.put(object);
            }
            result.put("Objects", objects);
        }

        result.put("Subject", subjectlist);
        return result;
    }

    /**
     * ************************ Merge two Json objects into one *****************************
     * @param o1
     * @param o2
     * @param subjectLabel
     * @param subjectType
     * @param subject
     * @return
     * @throws org.openrdf.repository.RepositoryException
     * @throws org.openrdf.query.MalformedQueryException
     * @throws org.openrdf.query.QueryEvaluationException 
     */
    
    public static JSONObject mergeJson(JSONObject o1, JSONObject o2, String subjectLabel, String subjectType, String subject)
            throws RepositoryException, MalformedQueryException, QueryEvaluationException {

        JSONObject result = new JSONObject();

        JSONObject subjectlist = new JSONObject();
        subjectlist.put("type", subjectType);
        subjectlist.put("label", subjectLabel);
        subjectlist.put("subject", subject);

        JSONArray objects1 = new JSONArray();
        if (o1.has("Objects")) {
            objects1 = o1.getJSONArray("Objects");
        }

        JSONArray objects2 = new JSONArray();

        if (o2.has("Objects")) {
            objects2 = o2.getJSONArray("Objects");
        }

        JSONArray objs = new JSONArray();

        for (int i = 0; i < objects1.length(); i++) {
            objs.put(objects1.get(i));
        }
        for (int i = 0; i < objects2.length(); i++) {
            objs.put(objects2.get(i));
        }

        if (objs.length() > 0) {
            result.put("Objects", objs);
        }
        result.put("Subject", subjectlist);

        return result;

    }
       
    /**
     * ************************** Virtuoso Case ******************************
     * @param resource
     * @return
     * @throws org.openrdf.repository.RepositoryException
     * @throws org.openrdf.query.MalformedQueryException
     * @throws org.openrdf.query.QueryEvaluationException
     */
    public static JSONObject virtuosocase(String resource, String label,String pref_labels,String show_incomingLinks) throws RepositoryException, MalformedQueryException, QueryEvaluationException {

        GetConfigProperties app = new GetConfigProperties();
        Properties props = app.getConfig("config.properties");
        
        String db_url = props.getProperty("db_url").trim();
        String db_port = props.getProperty("db_port").trim();
        String db_username = props.getProperty("db_username").trim();
        String db_password = props.getProperty("db_password").trim();
        String db_graphname = props.getProperty("db_graphname").trim();
        
        //String label = props.getProperty("schema_label").trim();
        //String pref_labels = props.getProperty("pref_labels").trim();
        
       
        String exclude_inverse = props.getProperty("exclude_inverse").trim();        
        List<String> exclusions = Arrays.asList(exclude_inverse.split("\\s*,\\s*"));

        String subject = resource;

        TripleStoreManager manager = new TripleStoreManager();
        manager.openConnectionToVirtuoso(db_url, db_port, db_username, db_password);

        subject = subject.replaceAll(" |\\r|\\n|\"", "");

        if (subject.length() > 2000) {
            subject = subject.substring(0, 500);
        }
       
        String subjectLabel = manager.returnLabel(subject, label);
        String subjectType = manager.returnType(subject);
                       
        String[] pref_lbls = pref_labels.split(",");

        if ((subjectLabel.isEmpty()) && (pref_lbls.length > 0)) {
            subjectLabel = manager.returnLabel(subject, pref_lbls[0]);
        }

        Map<Triple, List<Triple>> outgoingLinks = new HashMap<Triple, List<Triple>>();

        Set<String> labels = new TreeSet();

        labels.add(label);
        if (pref_lbls[0].length() > 0) {
            for (int i = 0; i < pref_lbls.length; i++) {                
                labels.add(pref_lbls[i]);
            }
        }
        
        outgoingLinks = manager.returnOutgoingLinksWithTypes(subject, labels, db_graphname);  
        JSONObject result = createJsonFile(outgoingLinks, subjectLabel, subjectType, subject);
        
        
        if(show_incomingLinks.equals("false")){
            return result;
        }else{
           
            Map<Triple, List<Triple>> incomingLinks = new HashMap<Triple, List<Triple>>();
            incomingLinks = manager.returnIncomingLinksWithTypes(subject, labels, db_graphname, exclusions);
            JSONObject result0 = createInvertJsonFile(incomingLinks, subjectLabel, subjectType, subject);

            //merge json shows inverse labels otherwise only outgoing links 
            return mergeJson(result, result0, subjectLabel, subjectType, subject);//result;
        
        }

     
        

    }
    
    /**
     * **************************Blazegraph Case ***************************
     * @param resource
     *
     * @return
     * @throws org.openrdf.repository.RepositoryException
     * @throws org.openrdf.query.MalformedQueryException
     * @throws org.openrdf.query.QueryEvaluationException
     */
    
    public static JSONObject blazegraphcase(String resource,String label,String pref_labels,String show_incomingLinks) throws RepositoryException, MalformedQueryException, QueryEvaluationException, Exception {

        String subject = resource;

        GetConfigProperties app = new GetConfigProperties();
        Properties props = app.getConfig("config.properties");

        String blazegraph_url = props.getProperty("blazegraph_url").trim();
        //String label = props.getProperty("schema_label").trim();
        //String pref_labels = props.getProperty("pref_labels").trim();
        BlazeGraphManager manager = new BlazeGraphManager();

        HttpClient httpClient = new HttpClient();
        httpClient.start();
        ExecutorService executor = Executors.newCachedThreadPool();
        manager.openConnectionToBlazegraph2(blazegraph_url, httpClient, executor);

        subject = subject.replaceAll(" |\\r|\\n|\"", "");

        if (subject.length() > 2000) {
            subject = subject.substring(0, 500);
        }

        String subjectLabel = manager.returnLabel(subject, label);
        String subjectType = manager.returnType(subject);

        String[] pref_lbls = pref_labels.split(",");

        if ((subjectLabel.isEmpty()) && (pref_lbls.length > 0)) {
            subjectLabel = manager.returnLabel(subject, pref_lbls[0]);
        }
                
        Map<Triple, List<Triple>> outgoingLinks = new HashMap<Triple, List<Triple>>();
        // Map<Triple, List<Triple>> incomingLinks = new HashMap<Triple, List<Triple>>();

        Set<String> labels = new TreeSet();

        labels.add(label);
        if (pref_lbls[0].length() > 0) {
            for (int i = 0; i < pref_lbls.length; i++) {
                labels.add(pref_lbls[i]);
            }
        }

        outgoingLinks = manager.returnOutgoingLinksWithTypes(subject, labels); 

        JSONObject result = createJsonFile(outgoingLinks, subjectLabel, subjectType, subject);
        
        executor.shutdownNow();
        httpClient.stop();
        httpClient.destroy();
        manager.repom.close();

        return result;
    }


    /**
     * **************************File Case******************************
     *
     * @param resource
     * @param filename
     * @return
     * @throws RepositoryException
     * @throws MalformedQueryException
     * @throws QueryEvaluationException
     * @throws Exception
     */
    
    public static JSONObject filecase(String resource, String filename,String label,String pref_labels,String show_incomingLinks, String parentProperty) throws RepositoryException, MalformedQueryException, QueryEvaluationException, Exception {

        GetConfigProperties app = new GetConfigProperties();
        Properties props = app.getConfig("config.properties");

        String defaultfolder = props.getProperty("default_folder").trim();
        String filepath = props.getProperty("filename").trim();
        
        String prefix = props.getProperty("prefix").trim();
       // String label = props.getProperty("schema_label").trim();
      //  String pref_labels = props.getProperty("pref_labels").trim();
      

        String subject = resource;

        RDFfileManager manager = new RDFfileManager();
        File inputFile = new File(filepath);

        if (inputFile.exists()) {
            manager.readFile(inputFile, "TURTLE");
        } else {
            filename = defaultfolder + System.getProperty("file.separator") + filename;
            inputFile = new File(filename);
            if (inputFile.exists()) {
                manager.readFile(inputFile, "TURTLE");
            }
        }

        subject = subject.replaceAll(" |\\r|\\n|\"", "");

        if (subject.length() > 2000) {
            subject = subject.substring(0, 500);
        }

        //String subjectLabel = manager.returnLabel(subject, label);
        String subjectLabel = manager.returnLabel(subject, new HashSet<String>(Arrays.asList(label)));
        String subjectType = manager.returnType(subject);

        String[] pref_lbls = pref_labels.split(",");

        if ((subjectLabel.isEmpty()) && (pref_lbls.length > 0)) {
           // subjectLabel = manager.returnLabel(subject, pref_lbls[0]);
            subjectLabel = manager.returnLabel(subject, new HashSet<String>(Arrays.asList(pref_lbls)));
        }

        Map<Triple, List<Triple>> outgoingLinks = new HashMap<Triple, List<Triple>>();
        // Map<Triple, List<Triple>> incomingLinks = new HashMap<Triple, List<Triple>>();

        Set<String> labels = new TreeSet();

        labels.add(label);
        if (pref_lbls[0].length() > 0) {
            for (int i = 0; i < pref_lbls.length; i++) {                
                labels.add(pref_lbls[i]);
            }
        } 
                
       // System.out.println("subject--->"+subject);
       // System.out.println("labels"+labels);
        outgoingLinks = manager.returnOutgoingLinksWithTypes(subject, labels);
        
      
        JSONObject result = createJsonFile(outgoingLinks, subjectLabel, subjectType, subject);
        
                
        if (show_incomingLinks.equals("false")) {
            return result;
        } else {
            
            String exclude_inverse = props.getProperty("exclude_inverse").trim();
            exclude_inverse = exclude_inverse +","+prefix+parentProperty;
            List<String> exclusions = Arrays.asList(exclude_inverse.split(","));
            
           // System.out.println(prefix+parentProperty);
            
            
            //merge json shows inverse labels otherwise only outgoing links 
            Map<Triple, List<Triple>> incomingLinks = new HashMap<Triple, List<Triple>>();
           // System.out.println(exclusions);
            incomingLinks = manager.returnIncomingLinksWithTypes(subject, labels, "", exclusions);
            JSONObject result0 = createInvertJsonFile(incomingLinks, subjectLabel, subjectType, subject);
            return mergeJson(result, result0, subjectLabel, subjectType, subject);//result;
        }
        
        //return result;
                    

    }

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     * @throws org.openrdf.repository.RepositoryException
     * @throws org.openrdf.query.MalformedQueryException
     * @throws org.openrdf.query.QueryEvaluationException
     */
    
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, RepositoryException, MalformedQueryException, QueryEvaluationException, Exception {

        response.setContentType("text/html;charset=UTF-8");

        try (PrintWriter out = response.getWriter()) {

            String resource = request.getParameter("resource");
            String filename = request.getParameter("folderpath");
            
            String parentProperty = request.getParameter("parentProperty");
            
            String schema_Label_uri = request.getParameter("schema_Label_uri");
            String pref_Label_uri = request.getParameter("pref_Label_uri");
            String show_incomingLinks = request.getParameter("show_incoming_links").trim();

            GetConfigProperties app = new GetConfigProperties();
            Properties props = app.getConfig("config.properties");
            String database = props.getProperty("database").trim();
        
            switch (database) {
                case "virtuoso":
                    out.println(virtuosocase(resource,schema_Label_uri,pref_Label_uri,show_incomingLinks ));
                    break;
                case "blazegraph":
                    out.println(blazegraphcase(resource,schema_Label_uri,pref_Label_uri,show_incomingLinks));
                    break;
                case "file":
                    out.println(filecase(resource, filename,schema_Label_uri,pref_Label_uri,show_incomingLinks, parentProperty));
                    break;
                default:
                    out.println("check_configuration");
                    break;
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
        try {
            processRequest(request, response);
        } catch (RepositoryException ex) {
            Logger.getLogger(GetData.class.getName()).log(Level.SEVERE, null, ex);
        } catch (MalformedQueryException ex) {
            Logger.getLogger(GetData.class.getName()).log(Level.SEVERE, null, ex);
        } catch (QueryEvaluationException ex) {
            Logger.getLogger(GetData.class.getName()).log(Level.SEVERE, null, ex);
        } catch (Exception ex) {
            Logger.getLogger(GetData.class.getName()).log(Level.SEVERE, null, ex);
        }
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
        try {
            processRequest(request, response);
        } catch (RepositoryException ex) {
            Logger.getLogger(GetData.class.getName()).log(Level.SEVERE, null, ex);
        } catch (MalformedQueryException ex) {
            Logger.getLogger(GetData.class.getName()).log(Level.SEVERE, null, ex);
        } catch (QueryEvaluationException ex) {
            Logger.getLogger(GetData.class.getName()).log(Level.SEVERE, null, ex);
        } catch (Exception ex) {
            Logger.getLogger(GetData.class.getName()).log(Level.SEVERE, null, ex);
        }
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
