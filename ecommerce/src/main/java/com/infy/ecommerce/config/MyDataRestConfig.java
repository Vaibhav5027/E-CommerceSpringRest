package com.infy.ecommerce.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import com.infy.ecommerce.entity.Country;
import com.infy.ecommerce.entity.Product;
import com.infy.ecommerce.entity.ProductCategory;
import com.infy.ecommerce.entity.State;

import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {
  

	private EntityManager entityManager;
	
	@Autowired
	public MyDataRestConfig(EntityManager entyManager){
		entityManager=entyManager;
	}
	
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

        HttpMethod[] theUnsupportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PATCH};

        // disable HTTP methods for Product: PUT, POST, DELETE and PATCH
    

        // disable HTTP methods for ProductCategory: PUT, POST, DELETE and PATCH
        httpDisabled(config, theUnsupportedActions,ProductCategory.class);
        httpDisabled(config, theUnsupportedActions,Product.class);
        httpDisabled(config, theUnsupportedActions,Country.class);
        httpDisabled(config, theUnsupportedActions,State.class);

     exposeIds(config);
    }

	private void httpDisabled(RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions,Class typclass) {
		config.getExposureConfiguration()
                .forDomainType(typclass)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions));
	}

	private void exposeIds(RepositoryRestConfiguration config) {
		   
		Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();
		
		List<Class> entityClasses=new ArrayList<>();
		
		
		for(EntityType newTypes:entities) {
			entityClasses.add(newTypes.getJavaType());
		}
		Class[] domainTypes=entityClasses.toArray(new Class[0]);
		config.exposeIdsFor(domainTypes);
	}
}