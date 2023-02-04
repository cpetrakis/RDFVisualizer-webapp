/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package api.core.utils;

import java.util.Comparator;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 *
 * @author minadakn
 */
public class Prioritise {

    public Map<String, List<IntPair>> prioritiseProperties(Map<String, List<IntPair>> priorities) {

        Iterator<Map.Entry<String, List<IntPair>>> iter = priorities.entrySet().iterator();

        while (iter.hasNext()) {
            Map.Entry<String, List<IntPair>> entry = iter.next();
            entry.getValue().sort(new Comparator<IntPair>() {

                @Override
                public int compare(IntPair o1, IntPair o2) {
                    if (o1.getPairValue() > o2.getPairValue()) {
                        return 1;
                    } else if (o1.getPairValue() == o2.getPairValue()) {
                        return 0; // You can change this to make it then look at the
                        //words alphabetical order
                    } else {
                        return -1;
                    }
                }
            });
        }
        return priorities;
    }
}
