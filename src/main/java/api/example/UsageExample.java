/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package api.example;

import api.core.impl.TripleStoreManager;
import api.core.utils.Triple;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.TreeSet;
import org.openrdf.query.MalformedQueryException;
import org.openrdf.query.QueryEvaluationException;
import org.openrdf.repository.RepositoryException;

/**
 *
 * @author minadakn
 */
public class UsageExample {

    public static void main(String[] args) throws RepositoryException, MalformedQueryException, QueryEvaluationException, FileNotFoundException, Exception {

//    
        //  file implementation
//         String subjectLabel = manager.returnLabel(subject,"http://www.w3.org/2000/01/rdf-schema#label");
//       
//       
//                
//                for ( ; results.hasNext() ; )
//                {
//                    QuerySolution soln = results.nextSolution() ;
//                    RDFNode x = soln.get("varName") ;       // Get a result variable by name.
//                    Resource r = soln.getResource("VarR") ; // Get a result variable - must be a resource
//                    Literal l = soln.getLiteral("VarL") ;   // Get a result variable - must be a literal
//                
//                
//                RDFTriple triple = new RDFTriple(soln.get("s").toString(),
//                   soln.get("p").toString(),
//                  soln.get("o").toString());
//
//                results2.add(triple);
//                
//                }
//        for (RDFTriple triple : results2){
//            
//            System.out.println("s"+triple.getSubject());
//            System.out.println("p"+triple.getPredicate());
//            System.out.println("o"+triple.getObject());
//        }
//        System.out.println(results2);
//         }}
//        
        TripleStoreManager manager = new TripleStoreManager();
//        
       // manager.openConnectionToVirtuoso("jdbc:virtuoso://localhost","1111","dba","dba");
        
         manager.openConnectionToVirtuoso("jdbc:virtuoso://139.91.183.60","1111","dba","dba");


      //  String subject = "http://collection.britishmuseum.org/id/object/JCF11740";
     //   String subject = "http://collection.britishmuseum.org/id/object/EOC10881";
        
        
     // String subject =   "http://collection.britishmuseum.org/id/thesauri/x9622";
     String subject = "http://collection.britishmuseum.org/id/thesauri/x8055";
      Set<String> labels = new TreeSet();
        
        labels.add("http://www.w3.org/2000/01/rdf-schema#label");
        labels.add("http://www.w3.org/2004/02/skos/core#prefLabel");
        
        String label = manager.returnLabel(subject,"http://www.w3.org/2000/01/rdf-schema#label");
        
        if(label.isEmpty()){
            label = manager.returnLabel(subject,"http://www.w3.org/2004/02/skos/core#prefLabel");
        }
        
        String type = manager.returnType(subject);
        
        System.out.println("label: "+label);
        System.out.println("type: "+type);
        
        Map<Triple,List<Triple>> outgoingLinks = new HashMap<Triple,List<Triple>>();
        
   //    outgoingLinks =  manager.returnOutgoingLinksWithTypes(subject,labels,"http://localhost:8890/BritishMuseum");
//       
        
        
          List<String> ur = new ArrayList();
        ur.add("http://collection.britishmuseum.org/id/ontology/PX_object_type");
        outgoingLinks =  manager.returnIncomingLinksWithTypes(subject,labels,"http://localhost:8890/BritishMuseum",ur);

        Iterator<Entry<Triple,List<Triple>>> iter = outgoingLinks.entrySet().iterator();
//
        while (iter.hasNext()) {
            Entry<Triple,List<Triple>> entry = iter.next();

            List<Triple> l = new ArrayList<Triple>();

            l = entry.getValue();
            

            for (int i=0; i<l.size(); i++){

                System.out.println("KEY-uri: "+entry.getKey().getSubject());
                System.out.println("KEY-label: "+entry.getKey().getLabel());
                System.out.println("KEY-type: "+entry.getKey().getType());
                
                System.out.println("Value-uri: "+entry.getValue().get(i).getSubject());
                System.out.println("Value-label: "+entry.getValue().get(i).getLabel());
                System.out.println("Value-type: "+entry.getValue().get(i).getType());
            }               

        }
        
//        HttpClient httpClient=new HttpClient();
//        httpClient.start();
//        ExecutorService executor=Executors.newCachedThreadPool();
//        final RemoteRepositoryManager repo = new RemoteRepositoryManager("http://localhost:9999/bigdata", httpClient, executor);
//       
//        
//  
//         List<BindingSet> retList= new ArrayList<>();
//        
//     //   RepositoryConnection repoConn=this.repo.getConnection();
//        
//        TupleQueryResult results = repo.getRepositoryForDefaultNamespace(). prepareTupleQuery("select * where {?s ?p ?o}").evaluate();
//        
//        while(results.hasNext())
//            retList.add(results.next());
//           
//        results.close();
//        
//
//            executor.shutdownNow();
//            httpClient.stop();
//            httpClient.destroy();
//           
//            repo.close();
//            System.out.println("CLOSED ");
//        }
//
//        
//        
//        
//        BlazeGraphManager manager = new BlazeGraphManager();
//
//        HttpClient httpClient = new HttpClient();
//        httpClient.start();
//        ExecutorService executor = Executors.newCachedThreadPool();
//
//        manager.openConnectionToBlazegraph2("http://localhost:9999/blazegraph", httpClient, executor);
//
//        String subject = "http://www.oeaw.ac.at/COIN/626";
//
//        //manager.query("select * where {?s ?p ?o}");
//
//        Set<String> labels = new TreeSet();
////        
//        labels.add("http://www.w3.org/2000/01/rdf-schema#label");
//        labels.add("http://www.w3.org/2004/02/skos/core#prefLabel");
//        // String label = manager.returnLabel(subject,"http://www.w3.org/2000/01/rdf-schema#label");
//        String type = manager.returnType(subject);
//
//        //System.out.println("label: "+label);
//        System.out.println("type: " + type);
//
//        Map<Triple, List<Triple>> outgoingLinks = new HashMap<Triple, List<Triple>>();
//
//        outgoingLinks = manager.returnOutgoingLinksWithTypes(subject, labels);
////       
//
//        Iterator<Entry<Triple, List<Triple>>> iter = outgoingLinks.entrySet().iterator();
////
//        while (iter.hasNext()) {
//            Entry<Triple, List<Triple>> entry = iter.next();
//
//            List<Triple> l = new ArrayList<Triple>();
//
//            l = entry.getValue();
//
//            for (int i = 0; i < l.size(); i++) {
//
//                System.out.println("KEY-uri: " + entry.getKey().getSubject());
//                System.out.println("KEY-label: " + entry.getKey().getLabel());
//                System.out.println("KEY-type: " + entry.getKey().getType());
//
//                System.out.println("Value-uri: " + entry.getValue().get(i).getSubject());
//                System.out.println("Value-label: " + entry.getValue().get(i).getLabel());
//                System.out.println("Value-type: " + entry.getValue().get(i).getType());
//            }
//
//        }
//        System.out.println("ofi");
//        executor.shutdownNow();
//        httpClient.stop();
//        httpClient.destroy();

        //  manager.repom.close();
    }
}
