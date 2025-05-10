package com.freelancex.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int id;
    public String name;
    @Column(unique = true)
    public String email;
    public String password;
    public String companyname;
    public String industryname;
    public Client() {
    }
    public Client(int id, String name, String email, String password, String companyname, String industryname) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.companyname = companyname;
        this.industryname = industryname;
    }
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getCompanyname() {
        return companyname;
    }
    public void setCompanyname(String companyname) {
        this.companyname = companyname;
    }
    public String getIndustryname() {
        return industryname;
    }
    public void setIndustryname(String industryname) {
        this.industryname = industryname;
    }
    
}
