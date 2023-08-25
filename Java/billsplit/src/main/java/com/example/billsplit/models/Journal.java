package com.example.billsplit.models;

import jakarta.persistence.*;
import org.hibernate.annotations.IndexColumn;

import java.math.BigDecimal;

@Entity
@Table(indexes = @Index(columnList = "pId"))
public class Journal {
    // Default fields are non-nullable
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment
    @Column(nullable = false)
    private Long txId ;

    @Column(nullable = false)
    private Long pId ;  // who paid for others

    @Column(nullable = false)
    private Long nId ;  // whose balance will be in negative

    @Column(nullable = false)
    private BigDecimal amount ;

    public Long getTxId() {
        return txId;
    }

    public void setTxId(Long txId) {
        this.txId = txId;
    }

    public Long getpId() {
        return pId;
    }

    public void setpId(Long pId) {
        this.pId = pId;
    }

    public Long getnId() {
        return nId;
    }

    public void setnId(Long nId) {
        this.nId = nId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
