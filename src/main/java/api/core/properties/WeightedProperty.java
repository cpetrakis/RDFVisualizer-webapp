/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package api.core.properties;

import com.thoughtworks.xstream.annotations.XStreamAlias;

/**
 *
 * @author minadakn
 */
@XStreamAlias("weighted_property")
public class WeightedProperty {

    @XStreamAlias("property_uri")
    public String propertyUri;
    
    @XStreamAlias("property_weight")
    public String propertyWeight;

}