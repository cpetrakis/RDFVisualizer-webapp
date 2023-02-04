/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package api.core.impl;

import api.core.utils.Pair;
import api.core.utils.Triple;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.bigdata.rdf.sail.webapp.client.RemoteRepository;
import com.bigdata.rdf.sail.webapp.client.RemoteRepositoryManager;
import java.util.Iterator;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import org.apache.jena.rdf.model.Resource;
import org.eclipse.jetty.client.HttpClient;
import org.openrdf.query.BindingSet;
import org.openrdf.query.MalformedQueryException;
import org.openrdf.query.QueryEvaluationException;
import org.openrdf.query.TupleQueryResult;
import org.openrdf.repository.RepositoryException;

/**
 *
 * @author minadakn
 */
public class BlazeGraphManager {

    private RemoteRepository repo;
    public RemoteRepositoryManager repom;

    public void openConnectionToBlazegraph(String sparqlEndPoint) throws RepositoryException, Exception {
        RemoteRepositoryManager repositoryManager = new RemoteRepositoryManager(sparqlEndPoint);
        this.repo = repositoryManager.getRepositoryForDefaultNamespace();
        this.repo.getRemoteRepositoryManager().close();
    }

    public void openConnectionToBlazegraph2(String sparqlEndPoint, HttpClient httpClient, ExecutorService executor) throws RepositoryException, Exception {
        this.repom = new RemoteRepositoryManager(sparqlEndPoint, httpClient, executor);
        this.repo = repom.getRepositoryForDefaultNamespace();
    }

    public void closeConnectionToBlazeGraph() throws RepositoryException, Exception {
        this.repo.getBigdataSailRemoteRepository().getConnection().close();
    }

    public List<BindingSet> query(String sparqlQuery) throws RepositoryException, Exception {

        List<BindingSet> retList = new ArrayList<>();
        TupleQueryResult results = this.repo.prepareTupleQuery(sparqlQuery).evaluate();

        while (results.hasNext()) {
            retList.add(results.next());
        }

        results.close();
        return retList;
    }

    public String selectAll() {
        String queryString = "Select * where {?s ?p ?o}";
        return queryString;
    }

    public String selectAll(List<String> namedgraphs) {
        String fromClauses = "";

        for (String namedgraph : namedgraphs) {
            fromClauses += "FROM <" + namedgraph + ">\n";
        }

        String queryString = "Select * \n" + fromClauses + "WHERE {?s ?p ?o}";
        return queryString;
    }

    public String selectAll(Resource resource) {
        String queryString = "Select * where {<" + resource.getURI().toString() + "> ?p ?o}";
        return queryString;
    }

    public String selectAll(Resource resource, List<String> namedgraphs) {
        String fromClauses = "";
        for (String namedgraph : namedgraphs) {
            fromClauses += "FROM <" + namedgraph + ">\n";
        }
        String queryString = "Select * \n" + fromClauses + "WHERE {<" + resource.getURI().toString() + "> ?p ?o}";
        return queryString;
    }

    public String selectAll(String resource) {
        String queryString = "Select * where {<" + resource + "> ?p ?o}";
        return queryString;
    }

    public String selectAll(String resource, List<String> namedgraphs) {
        String fromClauses = "";

        for (String namedgraph : namedgraphs) {
            fromClauses += "FROM <" + namedgraph + ">\n";
        }

        String queryString = "Select * \n" + fromClauses + "WHERE {<" + resource + "> ?p ?o}";
        return queryString;
    }

    public String selectLabels(String resource, String labelProperty) {
        String queryString = "Select ?label where {<" + resource + "> <" + labelProperty + "> ?label}";
        return queryString;
    }

    public String selectAllWithLabels(String labelProperty) {
        String queryString = "Select ?s ?p ?o ?slabel ?plabel ?olabel where {?s ?p ?o .\n"
                + "?s <" + labelProperty + "> ?slabel .\n"
                + "?p <" + labelProperty + "> ?plabel .\n"
                + "?o <" + labelProperty + "> ?olabel .\n"
                + " }";
        return queryString;
    }

    public String selectAllWithLabels(String resource, String labelProperty) {
        String queryString = "Select * where {<" + resource + "> ?p ?o .\n"
                + "<" + resource + "> <" + labelProperty + "> ?slabel .\n"
                + "?p <" + labelProperty + "> ?plabel .\n"
                + "?o <" + labelProperty + "> ?olabel .\n"
                + " }";
        return queryString;
    }

    public String selectAllOutgoingWithLabelsAndTypes(String resource, Set<String> labelProperties) {
//        String queryString = "Select *  where {<"+resource+"> ?p ?o .\n"
//                + "<"+resource+"> rdf:type ?stype .\n"
//                + "<"+resource+"> <"+labelProperty+"> ?slabel .\n"
//                + "OPTIONAL {?p <"+labelProperty+"> ?plabel }.\n"
//                //+ "OPTIONAL {?p rdf:type ?ptype} .\n"
//                + "?o <"+labelProperty+"> ?olabel .\n"
//                + "OPTIONAL {?o rdf:type ?otype} .\n"
//                + " }";

        String labelPropertiesParam = "";

        Iterator<String> iterator = labelProperties.iterator();
        while (iterator.hasNext()) {
            String labelProperty = iterator.next();
            labelPropertiesParam = labelPropertiesParam + " <" + labelProperty + "> |";
        }

        labelPropertiesParam = labelPropertiesParam.substring(0, labelPropertiesParam.length() - 1);

        String queryString = "Select *  \n"
                + "where\n"
                + "{ {\n"
                + "<" + resource + "> ?p ?o .\n"
                + "<" + resource + ">  rdf:type ?stype .\n"
                + "OPTIONAL {<" + resource + ">  \n"
                + labelPropertiesParam + "  ?slabel }.\n"
                + "OPTIONAL {?p " + labelPropertiesParam + " ?plabel }.\n"
                + "OPTIONAL {?o " + labelPropertiesParam + "  ?olabel }.\n"
                + "OPTIONAL {?o rdf:type ?otype} .\n"
                + "} "
                + "UNION\n"
                + "{ \n"
                + "<" + resource + "> ?p ?o \n"
                + ".\n"
                + "<" + resource + ">  rdf:type ?stype .\n"
                + "OPTIONAL {<" + resource + ">  \n"
                + labelPropertiesParam + "  ?slabel }.\n"
                + " OPTIONAL{?o " + labelPropertiesParam + "  ?olabel }.\n"
                + "OPTIONAL {?p " + labelPropertiesParam + "  ?plabel }.\n"
                + "  \n"
                + "FILTER(isLiteral(?o))\n"
                + "} }\n";
        // System.out.println("QUERY"+queryString);

        return queryString;
    }

    public String selectLabel(String resource, String labelProperty) {
        String queryString = "Select ?label where {<" + resource + "> <" + labelProperty + "> ?label .\n"
                + " }";
        return queryString;
    }

    public String selectType(String resource) {
        String queryString = "Select ?type where {<" + resource + "> rdf:type ?type .\n"
                + " }";
        return queryString;
    }

    public String returnLabel(String resource, String labelProperty) throws RepositoryException, MalformedQueryException, QueryEvaluationException, Exception {

        String query = selectLabel(resource, labelProperty);
        List<BindingSet> sparqlResults = query(query);
        String label = "";
        for (BindingSet result : sparqlResults) {
            label = result.getBinding("label").getValue().stringValue();
        }
        return label;
    }

    public String returnType(String resource) throws RepositoryException, MalformedQueryException, QueryEvaluationException, Exception {

        String query = selectType(resource);
        List<BindingSet> sparqlResults = query(query);
        String label = "";
        
        for (BindingSet result : sparqlResults) {
            label = result.getBinding("type").getValue().stringValue();
        }

        return label;

    }

//    public Map<String,List<String>> returnOutgoingLinks(String resource) throws RepositoryException, MalformedQueryException, QueryEvaluationException
//    {
//
//        Map<String,List<String>> outgoingLinks = new HashMap<String,List<String>>();
//        
//        String query = selectAll(resource);
//      
//        List<BindingSet> sparqlResults = query(query);
//       
//        for (BindingSet result : sparqlResults) {
//           
//            System.out.println(result.toString());
//           
//            String key = result.getBinding("p").getValue().stringValue();
//            String value = result.getBinding("o").getValue().stringValue();
//            
//             if(outgoingLinks.containsKey(key)) {
//
//             List<String> objects = outgoingLinks.get(key);
//
//             objects.add(value);
//
//        outgoingLinks.put(key, objects);
//
//    } else {
//            List<String> objects = new ArrayList();
//            objects.add(value);
//            outgoingLinks.put(key, objects);
//      
//
//    }
//    }
//
//        return outgoingLinks;
//        
//    }
    public Map<Pair, List<Pair>> returnOutgoingLinks(String resource, String labelProperty) throws RepositoryException, MalformedQueryException, QueryEvaluationException, Exception {

        Map<Pair, List<Pair>> outgoingLinks = new HashMap<Pair, List<Pair>>();

        String query = selectAllWithLabels(resource, labelProperty);

        List<BindingSet> sparqlResults = query(query);

        for (BindingSet result : sparqlResults) {

            //    System.out.println(result.toString());
            Pair mapKey = new Pair();
            Pair mapValue = new Pair();

            String key_uri = result.getBinding("p").getValue().stringValue();
            String key_label = result.getBinding("plabel").getValue().stringValue();
            mapKey.setPairKey(key_uri);
            mapKey.setPairValue(key_label);

            String value_uri = result.getBinding("o").getValue().stringValue();
            String value_label = result.getBinding("olabel").getValue().stringValue();
            mapValue.setPairKey(value_uri);
            mapValue.setPairValue(value_label);
            if (outgoingLinks.containsKey(mapKey)) {
                List<Pair> objects = outgoingLinks.get(mapKey);
                objects.add(mapValue);
                outgoingLinks.put(mapKey, objects);
            } else {
                List<Pair> objects = new ArrayList();
                objects.add(mapValue);
                outgoingLinks.put(mapKey, objects);
            }
        }
        return outgoingLinks;
    }

    public Map<Triple, List<Triple>> returnOutgoingLinksWithTypes(String resource, Set<String> labelProperty) throws RepositoryException, MalformedQueryException, QueryEvaluationException, Exception {

        Map<Triple, List<Triple>> outgoingLinks = new HashMap<Triple, List<Triple>>();
        String query = selectAllOutgoingWithLabelsAndTypes(resource, labelProperty);
        List<BindingSet> sparqlResults = query(query);

        for (BindingSet result : sparqlResults) {

            Triple mapKey = new Triple();
            Triple mapValue = new Triple();

            String key_uri = result.getBinding("p").getValue().stringValue();
            String key_label = "NOLABEL";
            if (result.getBinding("plabel") != null) {
                key_label = result.getBinding("plabel").getValue().stringValue();
            }

            String key_type = "NOTYPE";
            mapKey.setSubject(key_uri);
            mapKey.setLabel(key_label);
            mapKey.setType(key_type);

            String value_label = "NOLABEL";
            String value_type = "NOTYPE";
            String value_uri = result.getBinding("o").getValue().stringValue();

            if (result.getBinding("olabel") != null) {
                value_label = result.getBinding("olabel").getValue().stringValue();
            }

            if (result.getBinding("otype") != null) {
                value_type = result.getBinding("otype").getValue().stringValue();
            }
            mapValue.setSubject(value_uri);
            mapValue.setLabel(value_label);
            mapValue.setType(value_type);

            if (outgoingLinks.containsKey(mapKey)) {
                List<Triple> objects = outgoingLinks.get(mapKey);
                objects.add(mapValue);
                outgoingLinks.put(mapKey, objects);
            } else {
                List<Triple> objects = new ArrayList();
                objects.add(mapValue);
                outgoingLinks.put(mapKey, objects);
            }
        }
        return outgoingLinks;
    }

    public List<String> returnSubjects(String namedGraph) throws RepositoryException, MalformedQueryException, QueryEvaluationException, Exception {

        List<String> subjects = new ArrayList<>();
        List<String> namedgraphs = new ArrayList<>();
        namedgraphs.add(namedGraph);
        String query = selectAll(namedgraphs);
        List<BindingSet> sparqlResults = query(query);

        for (BindingSet result : sparqlResults) {
            String value = result.getBinding("s").getValue().stringValue();
            subjects.add(value);
        }
        return subjects;
    }
}
