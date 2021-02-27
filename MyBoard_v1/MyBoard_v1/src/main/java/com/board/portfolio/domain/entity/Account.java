package com.board.portfolio.domain.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Entity
@Table(
        name = "TB_ACCOUNT",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"NICKNAME"})
})
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public class Account extends EntityDefaultValues {

    @Id
    @Column(name="EMAIL")
    private String email;

    @Column(name="PASSWORD")
    @JsonIgnore
    private String password;

    @Column(name="NICKNAME")
    private String nickname;

    @Column(name="SIGNUP_DATE")
    @CreatedDate
    private LocalDateTime signUpDate;

    @Column(name="ROLE")
    @Enumerated(value= EnumType.STRING)
    private AccountRole role;

    @Column(name="IS_SOCIAL")
    private boolean isSocial;

    @Column(name="AUTH_KEY")
    private String authKey;

    @Column(name="IS_AUTH")
    private boolean isAuth;

    @OneToMany(mappedBy = "account")
    @JsonBackReference
    private List<Board> boardList;

    @OneToMany(mappedBy = "account")
    @JsonBackReference
    private List<Comment> commentList;

    @OneToMany(mappedBy = "account")
    @JsonBackReference
    private List<LikeBoard> likeBoardList;

    @OneToMany(mappedBy = "account")
    @JsonBackReference
    private List<LikeComment> likeCommentList;

    @OneToMany(mappedBy = "account")
    @JsonBackReference
    private List<FileAttachment> fileAttachmentList;

    @OneToMany(mappedBy = "targetAccount")
    @JsonBackReference
    private List<Alarm> myAlarmList;

    @OneToMany(mappedBy = "triggerAccount")
    @JsonBackReference
    private List<Alarm> triggerAlarmList;

    public Account(String email) {
        this.email = email;
    }

    @Override
    public void setDefaultValues() {
        this.role = Optional.ofNullable(this.role).orElse(AccountRole.MEMBER);
        this.authKey = Optional.ofNullable(this.authKey).orElse(UUID.randomUUID().toString());
        this.isAuth = Optional.ofNullable(this.isAuth).orElse(false);
        this.password = Optional.ofNullable(this.password).orElse("");
        this.nickname = Optional.ofNullable(this.nickname).orElse("임시닉네임:"+UUID.randomUUID().toString().substring(0,9));
        this.isSocial = Optional.ofNullable(this.isSocial).orElse(false);
    }

}
