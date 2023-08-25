package com.example.billsplit.repositories;

import com.example.billsplit.models.Journal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JournalRepo extends JpaRepository<Journal,Long> {
}
