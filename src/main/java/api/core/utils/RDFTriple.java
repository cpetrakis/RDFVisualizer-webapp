/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package api.core.utils;

/**
 *
 * @author minadakn
 */
public class RDFTriple {
    private String subject, predicate, object;
    
    public RDFTriple(String sub, String pre, String obj){
        this.subject=sub;
        this.predicate=pre;
        this.object=obj;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getPredicate() {
        return predicate;
    }

    public void setPredicate(String predicate) {
        this.predicate = predicate;
    }

    public String getObject() {
        return object;
    }

    public void setObject(String object) {
        this.object = object;
    }
}
