package cbnu.software.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggerConfig {
    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .select() // ApiSelectorBuilder 생성
                .apis(RequestHandlerSelectors.withClassAnnotation(RestController.class)) // api 스펙이 작성되어 있는 패키지 지정 // 현재 RequestMapping으로 할당된 모든 URL 리스트를 추출
                .paths(PathSelectors.any()) // 그중 /** 인 URL들만 필터링
                .build();
    }
        private ApiInfo apiInfo() {
        return new ApiInfo(
                "개인정보 보호 시스템 API",
                "게시글 파일 댓글 대댓글",
                "SpringBoot 2.7 java 11",
                "Terms of Serice URL",
                "contact Name",
                "License",
                "License URL"
                );
    }
}
