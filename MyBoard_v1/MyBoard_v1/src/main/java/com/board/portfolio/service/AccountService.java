package com.board.portfolio.service;

import com.board.portfolio.domain.dto.AccountDTO;
import com.board.portfolio.domain.entity.Account;
import com.board.portfolio.exception.custom.DuplicateNicknameException;
import com.board.portfolio.exception.custom.NotCorrectPasswordException;
import com.board.portfolio.exception.custom.NotFoundEmailException;
import com.board.portfolio.mail.EmailSender;
import com.board.portfolio.mail.manager.AuthMail;
import com.board.portfolio.repository.AccountRepository;
import com.board.portfolio.security.account.AccountSecurityDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static com.board.portfolio.util.StaticUtils.modelMapper;

@RequiredArgsConstructor
@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final EmailSender emailSender;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void signUp(AccountDTO.SignUp dto){
        dto.setPassword(passwordEncoder.encode(dto.getPassword()));
        Account account = modelMapper.map(dto, Account.class);
        account = accountRepository.save(account);
        String authKey = account.getAuthKey();
        LocalDateTime signUpDate = account.getSignUpDate();
        emailSender.sendAuthMail(new AuthMail(dto.getEmail(), signUpDate, authKey));

    }
    @Transactional
    public void authenticate(AccountDTO.Auth dto){
        String email = dto.getEmail();
        String authKey = dto.getAuthKey();
        accountRepository
                .findByEmailAndAuthKey(email, authKey)
                .orElseThrow(NotFoundEmailException::new)
                .setAuth(true);
        emailSender.completeAuthMail(email);
    }

    @Transactional
    public void modifyUserInfoAll(AccountDTO.ModifyAll dto, AccountSecurityDTO accountDTO) {

        if(!accountDTO.getNickname().equals(dto.getNickname())){
            if(accountRepository.existsByNickname(dto.getNickname())){
                throw new DuplicateNicknameException();
            }
        }
        Account account = accountRepository.findById(accountDTO.getEmail()).orElseThrow(NotFoundEmailException::new);
        if(!passwordEncoder.matches(dto.getNowPassword(), account.getPassword())){
            throw new NotCorrectPasswordException(dto.getNowPassword());
        }
        account.setNickname(dto.getNickname());
        account.setPassword(passwordEncoder.encode(dto.getPassword()));

    }

    @Transactional
    public void modifyUserInfo(AccountDTO.Modify dto, AccountSecurityDTO accountDTO) {
        Account account = accountRepository.findById(accountDTO.getEmail()).orElseThrow(NotFoundEmailException::new);
        account.setNickname(dto.getNickname());
    }

    @Transactional
    public void deleteAccount(AccountSecurityDTO accountDTO) {
        Account account = modelMapper.map(accountDTO, Account.class);
        accountRepository.delete(account);
    }
}
