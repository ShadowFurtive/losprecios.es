/*jshint esversion: 6 */
$(function() {


  function ComponentsVC(ajaxUrl, name = "Components", id = "#components") {
    // VIEWs
      this.name = name;
      this.id = id;
      this.url = ajaxUrl;
      this.userId;

      ComponentsVC.prototype.generateLine = function() {
        let size_x = Window.width();
        size_x = size_x / 15;
        let char = "_";
        while(size_x > 0){
          char +=  "_";
        }
        return char;
      };

      ComponentsVC.prototype.countriesList = function(components) {
        return this.generateLine + `
        <span class="nobr"><input type="text" class="search" value="${this.search}" placeholder="Search" onfocus="let v=this.value; this.value=''; this.value=v"> <img class="dsearch" title="Clean Search" src="public/icon_delete.png"/></span>
        <div class="groupProduct">` +
        components.reduce(
          (ac, component) => ac += 
          `<div>
          <button type="button" class="showproducts"   componentid="${component.paisesId}" title="showproducts"  > ${component.name} </button>
          
          </div>\n`, 
          ""); +  
          '</div>'
      };

      ComponentsVC.prototype.productsList = function(productos, user_permissions) {
        if(!user_permissions)
        return this.generateLine + `
        <span class="nobr"><input type="text" class="search" value="${this.search}" placeholder="Search" onfocus="let v=this.value; this.value=''; this.value=v"> <img class="dsearch" title="Clean Search" src="public/icon_delete.png"/></span>
        ` +
        productos.reduce(
          (ac, producto) => ac += 
          `<div>
          <label>${producto.name}  ${producto.price}</label>
          </div>\n`, 
          "");
        else
        return this.generateLine + `
        <span class="nobr"><input type="text" class="search" value="${this.search}" placeholder="Search" onfocus="let v=this.value; this.value=''; this.value=v"> <img class="dsearch" title="Clean Search" src="public/icon_delete.png"/></span>
        ` +
        productos.reduce(
          (ac, producto) => ac += 
          `<div>
          <button type="button" class="editproducto"   productoid="${producto.id}" title="editproducto"  > Edit</button>
          <label>${producto.name}  ${producto.price}</label>
          </div>\n`, 
          "");
      };

      ComponentsVC.prototype.loginForm = function() {
        return this.generateLine + `
       <label for="username">Nombre de usuario:</label><br>
       <input type="text" id="username" name="username"><br>
       <label for="password">Contraseña:</label><br>
       <input type="password" id="password" name="password"><br><br>
       <input class="submit" type="submit" value="Iniciar sesión">
        `
      };
    
      ComponentsVC.prototype.editProduct = function(id) {
        return this.generateLine + `
       <h1>Editar el precio de ${id}</h1>
       <label for="new_price">Precio nuevo de:</label><br>
       <input type="number" id="new_price" name="new_price"><br>
       <input class="edit_product_submit" type="submit" productoid=${id} value="Modificar precio">
        `
      };

      ComponentsVC.prototype.countriesController = function() {
        let where = {};
        let params = [where];
        $.ajax({
          dataType: "json",
          url: this.url+'/paises',
        })
        .then(r1 => {
          let paises = r1.message;
          $(this.id).html(this.countriesList(paises));
          if (this.search) $(this.id+' .search').focus();
        })
        .catch(error => {console.error(error.status, error.responseText);});
      };
      
      ComponentsVC.prototype.editProductController = function(id) {
        $(this.id).html(this.editProduct(id));
      }

      ComponentsVC.prototype.submitEditProductController = function(id) {
        let price = $(this.id+' input[name=new_price]').val();
        $.ajax({
          dataType: "json",
          method: "POST",
          url: this.url + '/paises',
          data: {id, price}
        })
        .then(() => {
          this.productsController(Number($(e.currentTarget).attr('componentid')), this.userId);
        })
        .catch(error => {console.error(error.status, error.responseText);});
      };

      ComponentsVC.prototype.loginController = function() {
        $(this.id).html(this.loginForm());
      };


      ComponentsVC.prototype.goBackController = function() {
        this.countriesList();
      };

      ComponentsVC.prototype.productsController = function(id, user_id) {
        let p1 = $.ajax({
          dataType: "json",
          url: this.url + '/paises/' + id,
        });
        let p2 = $.ajax({
          dataType: "json",
          method: "POST",
          url: this.url + '/paises',
          data: {id, user_id}
        });
        Promise.all([p1, p2])
        .then(([r1, r2]) => {
          let productos = r1.message;
          let user_permissions = r2.message;
          $(this.id).html(this.productsList(productos, user_permissions));
          if (this.search) $(this.id+' .search').focus();
        })
        .catch(error => {console.error(error.status, error.responseText);});
      };

      ComponentsVC.prototype.submitController = function() {
        let user = $(this.id+' input[name=username]').val();
        let password = $(this.id+' input[name=password]').val();
        console.log(user);
        console.log(password);
        $.ajax({
          dataType: "json",
          method: "POST",
          url: this.url,
          data: {user, password}
        })
        .then(r => {
          this.userId=r.message;
          this.countriesController();
        })
        .catch(error => {console.error(error.status, error.responseText)}) 
      };


      ComponentsVC.prototype.eventsController = function() {
        $(document).on('click', this.id+' .showproducts',   (e)=> this.productsController(Number($(e.currentTarget).attr('componentid')), this.userId));
        $(document).on('input', this.id+' .search', () => {this.search = $(this.id+' .search').val(); this.countriesController();});
        $(document).on('click', '.login', () => this.loginController());
        $(document).on('click', '.goback', () => this.goBackController());
        $(document).on('click', this.id+' .submit', () => this.submitController());
        $(document).on('click', this.id+' .editproducto', () => this.editProductController(Number($(e.currentTarget).attr('productoid'))));
        $(document).on('click', this.id+' .edit_product_submit', () => this.submitEditProductController(Number($(e.currentTarget).attr('productoid'))));
        
      };
    
      this.countriesController();
      this.eventsController();     
    }
    
    
    // Creation of an object View-Controller for the tasks
    let components_vc = new ComponentsVC('http://localhost:8000');
    });