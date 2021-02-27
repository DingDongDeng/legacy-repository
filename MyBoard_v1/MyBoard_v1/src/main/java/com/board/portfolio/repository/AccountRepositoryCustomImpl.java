package com.board.portfolio.repository;

import com.board.portfolio.domain.entity.Account;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

import static com.board.portfolio.domain.entity.QAccount.account;
@RequiredArgsConstructor
public class AccountRepositoryCustomImpl implements AccountRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public boolean existsByEmail(String email) {
        return Optional.ofNullable(
                queryFactory
                .selectFrom(account)
                .where(account.email.eq(email))
                .fetchOne())
                .isPresent();
    }

    @Override
    public boolean existsByNickname(String nickname) {
        return Optional.ofNullable(
                queryFactory
                .selectFrom(account)
                .where(account.nickname.eq(nickname))
                .fetchOne())
                .isPresent();
    }

    @Override
    public Optional<Account> findByEmailAndAuthKey(String email, String authKey) {
        return Optional.ofNullable(
                queryFactory.selectFrom(account)
                .where(account.email.eq(email),account.authKey.eq(authKey))
                .fetchOne());
    }

    @Override
    public boolean existsByAuthKey(String authKey) {
        return Optional.ofNullable(
                queryFactory.selectFrom(account)
                .where(account.authKey.eq(authKey))
                .fetchOne())
                .isPresent();
    }

    @Override
    public boolean existsByEmailAndAuthKeyAndIsAuth(String email, String authKey, boolean isAuth) {
        return Optional.ofNullable(
                queryFactory.selectFrom(account)
                .where(account.email.eq(email), account.authKey.eq(authKey), account.isAuth.eq(isAuth))
                .fetchOne())
                .isPresent();
    }

    @Override
    public List<Account> findAllByIsAuthOrderBySignUpDateAsc(boolean isAuth) {
        return queryFactory
                .selectFrom(account)
                .where(account.isAuth.eq(isAuth))
                .orderBy(account.signUpDate.asc())
                .fetch();
    }
}
