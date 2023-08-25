package com.example.billsplit.controllers;

import com.example.billsplit.models.Person;
import com.example.billsplit.repositories.PersonRepo;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PersonController {
    private final PersonRepo personRepo ;

    public PersonController(PersonRepo personRepo) {
        this.personRepo = personRepo;
    }

    @PostMapping("/newperson")
    public String newPersonEntry(@RequestBody Person person){
        System.out.println(person.getBalance());
        System.out.println(person.getEmailId());
        personRepo.save(person) ;
        return "yes" ;
    }
}
