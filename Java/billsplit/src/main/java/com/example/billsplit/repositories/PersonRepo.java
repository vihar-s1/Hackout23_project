package com.example.billsplit.repositories;

import com.example.billsplit.models.Person;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonRepo extends JpaRepository<Person, Long> {
}
