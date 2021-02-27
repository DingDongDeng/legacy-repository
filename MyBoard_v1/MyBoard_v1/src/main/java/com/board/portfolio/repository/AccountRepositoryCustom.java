package com.board.portfolio.repository;

import com.board.portfolio.domain.entity.Account;

import java.util.List;
import java.util.Optional;

public interface AccountRepositoryCustom {
    boolean existsByEmail(String email);

    boolean existsByNickname(String nickname);

    Optional<Account> findByEmailAndAuthKey(String email, String authKey);

    boolean existsByAuthKey(String authKey);

    boolean existsByEmailAndAuthKeyAndIsAuth(String email, String authKey, boolean isAuth);

    List<Account> findAllByIsAuthOrderBySignUpDateAsc(boolean isAuth);
}
