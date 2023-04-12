package cbnu.software.controller;

import cbnu.software.Entity.FileEntity;
import cbnu.software.service.FileService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriUtils;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;

@RequiredArgsConstructor //생성자 생성과 의존관계를 진행해줌
@RestController
@CrossOrigin(origins = {"http://localhost:3000"})
@Api(tags = {"File Info"}, description = "파일 서비스")
public class FileController {
    private final FileService fileService;

    @ApiOperation(value = "파일 업로드", notes = "블라인드처리할 사진을 등록한다.")
    @PostMapping(value = "/upload",consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> upload(@RequestPart MultipartFile file) throws IOException
    {
        try {
            System.out.println("flaskimage : " + requestflask(file));
            FileEntity uploadfile = fileService.uploadfile(file);
            return ResponseEntity.ok().body(uploadfile.getId()); //파일을 업로드하고 api url을 전달
        }catch (Exception e)
        {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }

    }
    @ApiOperation(value = "모든 파일 제공")
    @GetMapping("/files")
    public ResponseEntity<List<FileEntity>> files()
    {
        List<FileEntity> files = fileService.files();
        return ResponseEntity.ok().body(files);
    }

    @ApiOperation(value = "파일을 삭제한다")
    @GetMapping("/delete/{id}")
    public String deleteFile(@PathVariable Long id)
    {
        fileService.filedelete(id);
        return "파일삭제성공";
    }

    @ApiOperation(value = "이미지 받아오기")
    @GetMapping("/image/{id}")
    public ResponseEntity<?> showimage(@PathVariable Long id) throws MalformedURLException
    {
        try {
            FileEntity fileEntity= fileService.findById(id);
            Resource resource = new UrlResource("file:" + fileEntity.getFile_path());
            return ResponseEntity.ok().body(resource);
        }catch (Exception e)
        {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @ApiOperation(value = "첨부 파일 다운로드")
    @GetMapping("/attach/{id}")
    public ResponseEntity<Resource> downloadAttach(@PathVariable Long id) throws MalformedURLException {

        FileEntity file = fileService.findById(id);

        UrlResource resource = new UrlResource("file:" + file.getFile_path());

        String encodedFileName = UriUtils.encode(file.getOriginalFileName(), StandardCharsets.UTF_8); //한글인코딩

        // 파일 다운로드 대화상자가 뜨도록 하는 헤더를 설정해주는 것
        // Content-Disposition 헤더에 attachment; filename="업로드 파일명" 값을 준다.
        String contentDisposition = "attachment; filename=\"" + encodedFileName + "\"";

        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,contentDisposition).body(resource);
    }
    @PostMapping("/1234") //전달되는것을 확인할 수 있다.
    public String test(@RequestBody byte[] image)
    {
        return image + "가나다";
    }


    public String getBase64String(MultipartFile multipartFile) throws Exception {
        byte[] bytes = multipartFile.getBytes();
        return Base64.getEncoder().encodeToString(bytes);
    }
    public String requestflask (MultipartFile file) throws Exception
    {
        RestTemplate restTemplate = new RestTemplate(); //restTemplate 생성

        // Header set
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        // Body set
        MultiValueMap<String, String > body = new LinkedMultiValueMap<>();
        String imageFileString = getBase64String(file);
        body.add("image", imageFileString);

        // Message
        HttpEntity<?> requestMessage = new HttpEntity<>(body, httpHeaders);

        // Request
        HttpEntity<String> response = restTemplate.postForEntity("http://localhost:8080/1234", requestMessage, String.class);

        return response.getBody();
    }



}
