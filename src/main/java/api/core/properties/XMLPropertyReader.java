/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package api.core.properties;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

/**
 *
 * @author minadakn
 */
public class XMLPropertyReader {

    private Properties prop;

    public XMLPropertyReader() throws IOException {

        this.prop = new Properties();
        File file = new File("./" + Resources.propertyFilename);
        FileInputStream fileInput = new FileInputStream(file);
        prop.loadFromXML(fileInput);
        fileInput.close();

    }

    public String getProperty(String property) {
        String retValue = this.prop.getProperty(property);
        return retValue;
    }

}
