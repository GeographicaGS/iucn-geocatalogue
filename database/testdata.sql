INSERT INTO data."user"(id_profile, name, surname, password, email)
  VALUES (3,'Raúl','Yeguas','81dc9bdb52d04dc20036dbd8313ed055','raul.yeguas@geographica.gs');
INSERT INTO data."user"(id_profile, name, surname, password, email)
  VALUES (3,'Alberto','Asuero','eac9e8dd8575f4c7831f1f6a72607126','alberto@geographica.gs');
INSERT INTO data."user"(id_profile, name, surname, password, email)
  VALUES (3,'Cayetano','Benavent','eac9e8dd8575f4c7831f1f6a72607126','cayetano.benavent@geographica.gs');


INSERT INTO data.layer(id_code_num, department, theme, subtheme, family, name, filetype, crs, extension, scale, review_date, edition_date, summary, project_name, source, publication, link, bounding_box, data_responsible, metadata_responsible, language, access_limitation, other_info)
  VALUES ('AB1234_XYZ','BASIC','Protected Areas','','','WDPA_Sept2015-shapefile-polygons','Shapefile','4326','World','','2015-09-10','2015-10-01','World Database on Protected Areas. Global database on terrestrial and marine protected areas. See more http://www.protectedplanet.net/','No project','Protected Planet http://www.protectedplanet.net/','','Z:\GIS\Basic\Protected Areas\WDPA_Sept2015','','Lourdes Lazaro','Lourdes Lazaro','English','Neither (a) the WDPA Materials nor (b) any work derived from or based upon the WDPA Materials (“Derivative Works”) may be put to Commercial Use without the prior written permission of UNEP-WCMC. ','You can find this file with the last update in http://www.protectedplanet.net/');

INSERT INTO data.layer_keyword(id_layer, keyword)
  VALUES (1, 'protected area');

INSERT INTO data.layer_keyword(id_layer, keyword)
  VALUES (1, 'world');

