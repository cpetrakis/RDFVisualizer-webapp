/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package api.core.properties;

import com.thoughtworks.xstream.XStream;
import api.core.utils.IntPair;
import com.thoughtworks.xstream.security.NoTypePermission;
import com.thoughtworks.xstream.security.NullPermission;
import com.thoughtworks.xstream.security.PrimitiveTypePermission;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 * @author minadakn
 */
public class XSTREAMpropertyReader {

    public Map<String, List<IntPair>> returnPriorities(String filePath) throws FileNotFoundException {

        FileReader reader = new FileReader(filePath);  // load file
        XStream xstream = new XStream();
        
        //security
        // clear out existing permissions and set own ones
        xstream.addPermission(NoTypePermission.NONE);
        xstream.addPermission(NullPermission.NULL);
        xstream.addPermission(PrimitiveTypePermission.PRIMITIVES);
        xstream.allowTypeHierarchy(Collection.class);
        // allow any type from the same package
        xstream.allowTypesByWildcard(new String[] {
        "api.core.**"
        });
        //
        xstream.processAnnotations(Xproperties.class);
        xstream.processAnnotations(Preference.class);
        xstream.processAnnotations(WeightedProperty.class);
        Xproperties data = (Xproperties) xstream.fromXML(reader);
        Preference firstPreference = (Preference) data.preferences.get(0);
        WeightedProperty wp = (WeightedProperty) firstPreference.weightedProperties.get(0);
        Map<String, List<IntPair>> priorities = new HashMap<String, List<IntPair>>();
        List<Preference> preferences = data.preferences;
        for (Preference pref : preferences) {

            List<WeightedProperty> wproperties = pref.weightedProperties;
            List<IntPair> wPairs = new ArrayList();
            for (WeightedProperty wproperty : wproperties) {
                IntPair weightPair = new IntPair();
                weightPair.setPairKey(wproperty.propertyUri);
                weightPair.setPairValue(Integer.parseInt(wproperty.propertyWeight));
                wPairs.add(weightPair);
            }
            priorities.put(pref.type_uri, wPairs);
        }
        return priorities;
    }

}
