function readConfig(){
  // Read configuration data
  var $config = null;

  $.ajax({
    url       : 'config.txt',
    async     : false,
    dataType  : 'json',
    success   : function (jsonData) {
      $config = jsonData;
    }
  });

  return $config;

}