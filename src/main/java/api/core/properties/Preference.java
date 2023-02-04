/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package api.core.properties;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamImplicit;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author minadakn
 */
@XStreamAlias("preference")
public class Preference {

    @XStreamAlias("type_uri")
    public String type_uri;

    @XStreamImplicit(itemFieldName = "weighted_property")
    public List weightedProperties = new ArrayList();

}