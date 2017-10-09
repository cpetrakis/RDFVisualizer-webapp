/*
 * To change this license header, choose License Headers in Project GetConfigProperties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gr.ics.forth.rdfvisualizer.webapp;

/**
 *
 * @author cpetrakis
 */

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;


public class GetConfigProperties {
    
  public Properties getConfig(String filename) {

	Properties prop = new Properties();
	InputStream input = null;
              
    try {

                //ClassLoader classLoader =  Thread.currentThread().getContextClassLoader();
    		input =  getClass().getClassLoader().getResourceAsStream(filename);
                
    		if(input==null){
    	            System.out.println("Unable to find " + filename);    		    
    		}
    		//load a properties file from class path, inside static method
    		prop.load(input);

    	} catch (IOException ex) {
    		ex.printStackTrace();
        } finally{
        	if(input!=null){
        		try {
				input.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
        	}
        }
    
        return prop;
    }

  }
