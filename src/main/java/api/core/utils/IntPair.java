/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package api.core.utils;

import java.util.Objects;

/**
 * Pair objects are being used to hold information about paired values.
 *
 * @author Nikos Minadakis (minadakn 'at' ics 'dot' forth 'dot' gr)
 * @author Yannis Marketakis (marketak 'at' ics 'dot' forth 'dot' gr)
 */
public class IntPair {

    private String key;
    private int value;

    public IntPair() {
        this.key = "";
        this.value = 0;
    }

    public static IntPair of(String key, int value) {
        return new IntPair(key, value);
    }

    public IntPair(String key, int value) {
        this.key = key;
        this.value = value;
    }

    public String getPairKey() {
        return key;
    }

    public void setPairKey(String key) {
        this.key = key;
    }

    public int getPairValue() {
        return value;
    }

    public void setPairValue(int value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return "<" + this.key + "," + this.value + ">";
    }

    @Override
    public boolean equals(Object anotherObject) {
        if (anotherObject instanceof IntPair) {
            IntPair anotherPair = (IntPair) anotherObject;
            return this.key.equals(anotherPair.getPairKey()) && (this.value == anotherPair.getPairValue());
        } else {
            return false;
        }

    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 59 * hash + Objects.hashCode(this.key);
        hash = 59 * hash + Objects.hashCode(this.value);
        return hash;
    }
}
