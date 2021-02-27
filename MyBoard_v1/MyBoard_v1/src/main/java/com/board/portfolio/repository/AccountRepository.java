package com.board.portfolio.repository;

import com.board.portfolio.domain.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface AccountRepository extends JpaRepository<Account,String>, AccountRepositoryCustom {

    @Transactional
    void deleteByEmailAndIsAuth(String email, boolean isAuth);
}
