package com.board.portfolio.domain.dto;

import com.board.portfolio.validation.anotation.AuthKeyExist;
import com.board.portfolio.validation.anotation.EmailDuplicate;
import com.board.portfolio.validation.anotation.EmailExist;
import com.board.portfolio.validation.anotation.NicknameDuplicate;
import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class AccountDTO {
    @Data
    public static class SignUp extends PasswordDTO{
        @NotBlank(message = "{nickname.not.blank}")
        @Size(min=5,max=10,message = "{nickname.size}")
        @NicknameDuplicate(message = "{nickname.duplicate}")
        private String nickname;

        @NotBlank(message = "{email.not.blank}")
        @Email(message = "{email.email}")
        @Size(min=5,max=40,message = "{email.size}")
        @EmailDuplicate(message = "{email.duplicate}")
        private String email;
    }

    @Data
    public static class SignIn{
        private String email;
        private String password;
    }
    @Data
    public static class Auth{
        @NotBlank(message = "{email.not.blank}")
        @EmailExist(message = "{email.exist}")
        private String email;
        @NotBlank(message = "{authkey.not.blank}")
        @AuthKeyExist(message = "{authkey.exist}")
        private String authKey;
    }

    @Data
    public static class ModifyAll extends PasswordDTO {
        @NotBlank(message = "{nickname.not.blank}")
        @Size(min=5,max=10,message = "{nickname.size}")
        private String nickname;
        @NotBlank(message = "{password.not.blank}")
        private String nowPassword;
    }

    @Data
    public static class Modify {
        @NotBlank(message = "{nickname.not.blank}")
        @Size(min=5,max=10,message = "{nickname.size}")
        @NicknameDuplicate(message = "{nickname.duplicate}")
        private String nickname;
    }
}
