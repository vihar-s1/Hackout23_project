package com.example.billsplit.controllers;

import com.example.billsplit.models.Journal;
import com.example.billsplit.repositories.JournalRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class JournalController {
    private final JournalRepo journalRepo ;

    @Autowired
    public JournalController(JournalRepo journalRepo) {
        this.journalRepo = journalRepo;
    }

    @PostMapping("/newentry")
    public String newJournalEntry(@RequestBody Journal journal){
        journalRepo.save(journal) ;
        return "true" ;
    }
}
