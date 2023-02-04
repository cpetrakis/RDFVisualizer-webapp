/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package api.core.properties;

import java.io.FileReader;
import java.io.IOException;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

public class PropertyReader {

    private Properties prop;

    public PropertyReader() throws IOException {

        this.prop = new Properties();

        try {
            prop.load(new FileReader("./" + Resources.propertyFilename));
        } catch (IOException ex) {

            Logger.getLogger(PropertyReader.class.getName()).log(Level.SEVERE, null, ex);
            System.out.println("IOException: " + ex.getMessage() + "\n" + "Arguments Expected");

        }
    }

    public String getProperty(String property) {
        String retValue = this.prop.getProperty(property);
        return retValue;
    }
}
