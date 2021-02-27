package com.board.portfolio.controller;

import com.board.portfolio.domain.dto.AccountDTO;
import com.board.portfolio.security.account.AccountSecurityDTO;
import com.board.portfolio.service.AccountService;
import com.board.portfolio.validation.validator.AccountAuthValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;
    private final AccountAuthValidator accountAuthValidator;

    @PostMapping("/account")
    public ResponseEntity signUp(@RequestBody @Valid AccountDTO.SignUp dto){
        accountService.signUp(dto);
        return ResponseEntity.ok(Result.SUCCESS);
    }
    @GetMapping("/authenticate")
    public ResponseEntity authenticate(@Valid AccountDTO.Auth dto){
        accountService.authenticate(dto);
        return ResponseEntity.ok(Result.SUCCESS);
    }

    @PreAuthorize("hasRole('ROLE_MEMBER')")
    @PutMapping("/account")
    public ResponseEntity modifyUserInfoAll(@RequestBody @Valid AccountDTO.ModifyAll dto,
                                         @ModelAttribute("accountDTO") AccountSecurityDTO accountDTO){
        accountService.modifyUserInfoAll(dto,accountDTO);
        return ResponseEntity.ok(Result.SUCCESS);
    }

    @PreAuthorize("hasRole('ROLE_MEMBER')")
    @PatchMapping("/account")
    public ResponseEntity modifyUserInfo(@RequestBody @Valid AccountDTO.Modify dto,
                                         @ModelAttribute("accountDTO") AccountSecurityDTO accountDTO){
        accountService.modifyUserInfo(dto,accountDTO);
        return ResponseEntity.ok(Result.SUCCESS);
    }

    @PreAuthorize("hasRole('ROLE_MEMBER')")
    @DeleteMapping("/account")
    public ResponseEntity deleteAccount(@ModelAttribute("accountDTO") AccountSecurityDTO accountDTO){
        accountService.deleteAccount(accountDTO);
        return ResponseEntity.ok(Result.SUCCESS);
    }

    @InitBinder("auth")
    protected void initBinderAuth(WebDataBinder binder){ binder.addValidators(accountAuthValidator); }
}
