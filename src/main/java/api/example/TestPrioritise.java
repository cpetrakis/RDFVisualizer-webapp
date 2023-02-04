/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package api.example;


import api.core.properties.XSTREAMpropertyReader;
import api.core.utils.IntPair;
import api.core.utils.Prioritise;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.openrdf.query.MalformedQueryException;
import org.openrdf.query.QueryEvaluationException;
import org.openrdf.repository.RepositoryException;

/**
 *
 * @author minadakn
 */
public class TestPrioritise {
    public static void main(String[] args) throws RepositoryException, MalformedQueryException, QueryEvaluationException, FileNotFoundException, IOException{
      
        Map<String,List<IntPair>> priorities = new HashMap<String,List<IntPair>>();
        Map<String,List<IntPair>> prioritiesSorted = new HashMap<String,List<IntPair>>();
        
        XSTREAMpropertyReader xreader = new XSTREAMpropertyReader();
        
       // List<Preference> preferences = data.preferences;
        priorities = xreader.returnPriorities("properties.xml");
        
     //   System.out.println(priorities);
        
        Prioritise pr = new Prioritise();
        prioritiesSorted = pr.prioritiseProperties(priorities);

      //  System.out.println(prioritiesSorted);
    }
        
}
