#REM Prepend the "adt" part with path to your installed air sdk bin folder (http://www.adobe.com/products/air/tools/sdk/)
echo jQAPI Air Offline application
echo ****************************  
echo building...
adt -package -storetype pkcs12 -keystore jQAPI.p12 jQAPI-1.4.2.air ./application.xml -C ./../ css docs images js lib blank.html favicon.ico index.html navigation.html air/loader.html air/images