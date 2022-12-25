/*jshint esversion: 6 */
$(function() {


  function ComponentsVC(ajaxUrl, name = "Components", id = "#components") {
    // VIEWs
      this.name = name;
      this.id = id;
      this.url = ajaxUrl;
      ComponentsVC.prototype.componentList = function(components) {
        console.log("hola");
        return `
        <span class="nobr"><input type="text" class="search" value="${this.search}" placeholder="Search" onfocus="let v=this.value; this.value=''; this.value=v"> <img class="dsearch" title="Clean Search" src="public/icon_delete.png"/></span>
        ` +
        components.reduce(
          (ac, component) => ac += 
          `<div>
          <button type="button" class="edit"   componentid="${component.id}" title="Edit"  > ${component.name} </button>
          
          </div>\n`, 
          "");
      };
      
      ComponentsVC.prototype.listController = function() {
        let where = {};
        let params = [where];
        let p1 = $.ajax({
          dataType: "json",
          url: this.url+'/paises',
        });
        let p2 = $.ajax({
          dataType: "json",
          url: this.url + '/paises/count',
        });
        Promise.all([p1, p2])
        .then(([r1, r2]) => {
          let paises = r1.message;
          $(this.id).html(this.componentList(paises));
          if (this.search) $(this.id+' .search').focus();
        })
        .catch(error => {console.error(error.status, error.responseText);});
      };
      
      ComponentsVC.prototype.eventsController = function() {
        $(document).on('input', this.itaskListd+' .search', () => {this.search = $(this.id+' .search').val(); this.listController();});
      };
    
      this.listController();
      this.eventsController();     
    }
    
    
    // Creation of an object View-Controller for the tasks
    let components_vc = new ComponentsVC('http://localhost:8000');
    });