package com.board.portfolio.security.account;

import com.board.portfolio.domain.entity.Account;
import com.board.portfolio.repository.AccountRepository;
import com.board.portfolio.security.exception.NotFoundEmailException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AccountDetailsService implements UserDetailsService {
    private final AccountRepository accountRepository;
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Account account = accountRepository.findById(email).orElseThrow(NotFoundEmailException::new);
        return AccountDetails.transFromAccountWithSave(account);
    }
}
