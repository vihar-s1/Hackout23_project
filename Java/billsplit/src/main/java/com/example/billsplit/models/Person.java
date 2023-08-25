package com.example.billsplit.models;

import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;

@Entity
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment strategy
    @Column(nullable = false)
    private Long pId ;

    @Column(nullable = true)
    private String name ;

    @Column(nullable = false)
    private String emailId ;

    @Column(nullable = false)
    private String phoneNo ;

    @Column(precision = 10, scale = 2)
    private BigDecimal balance = BigDecimal.ZERO ;

    public Long getpId() {
        return pId;
    }

    public void setpId(Long pId) {
        this.pId = pId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmailId() {
        return emailId;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }

    public String getPhoneNo() {
        return phoneNo;
    }

    public void setPhoneNo(String phoneNo) {
        this.phoneNo = phoneNo;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }
}
