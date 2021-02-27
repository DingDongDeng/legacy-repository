package com.board.portfolio.validation.validator.constraint;

import com.board.portfolio.validation.anotation.FileSize;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.text.MessageFormat;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class FileSizeValidator implements ConstraintValidator<FileSize, List<MultipartFile>> {

    private int fileSize;
    private boolean nullable;
    @Override
    public void initialize(FileSize fileSize) {
        this.fileSize = fileSize.fileSize();
        this.nullable = fileSize.nullable();
    }
    @Override
    public boolean isValid(List<MultipartFile> fileList, ConstraintValidatorContext cxt) {
        boolean state = true;
        if(fileList==null&&nullable==false)
            return false;
        if(fileList!=null){
            for(MultipartFile file : fileList){
                if(nullable==true)
                    state = validNullabeFile(file,cxt);
                if(nullable==false)
                    state = validFile(file,cxt);
                if(state==false)
                    break;
            }
        }
        return state;
    }
    private boolean validNullabeFile(MultipartFile file, ConstraintValidatorContext cxt){
        if(isNull(file))
            return true;
        if(!isFileSizeFit(file)) {
//            setValidatorDefaultMessageFormat("파일 사이즈가 적절하지 않습니다. \n ({0})이하 크기로 입력해주세요", fileSize, cxt);
            return false;
        }
        return true;
    }
    private boolean validFile(MultipartFile file, ConstraintValidatorContext cxt){
        if(isNull(file)){
//            setValidatorDefaultMessageFormat("파일이 null 입니다. \n ({0})이하 크기로 입력해주세요",fileSize,cxt);
            return false;
        }
        if(!isFileSizeFit(file)){
//            setValidatorDefaultMessageFormat("파일 사이즈가 적절하지 않습니다. \n ({0})이하 크기로 입력해주세요",fileSize,cxt);
            return false;
        }
        return true;
    }

    private boolean isFileSizeFit(MultipartFile file){
        return fileSize>=file.getSize();
    }

    private boolean isNull(Object obj){
        return !Optional.ofNullable(obj).isPresent();
    }

    private void setValidatorDefaultMessageFormat(String msg,Integer fileSize, ConstraintValidatorContext cxt){
        cxt.disableDefaultConstraintViolation();
        cxt.buildConstraintViolationWithTemplate(
                MessageFormat.format(msg, fileSize))
                .addConstraintViolation();
    }
}