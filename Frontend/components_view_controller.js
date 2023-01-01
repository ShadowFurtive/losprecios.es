/*jshint esversion: 6 */
$(function() {


  function ComponentsVC(ajaxUrl, name = "Components", id = "#components") {
    // VIEWs
      this.name = name;
      this.id = id;
      this.url = ajaxUrl;
      this.userId;
      this.search = "";
      this.searchProduct = "";

      ComponentsVC.prototype.countriesList = function(components) {
        return  `
        <div class="barraBuscador">
                <button class="btn-search dsearch" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                </svg>
                </button>
                <input type="text" class="search" value="${this.search}" placeholder="Búscar pais..." onfocus="let v=this.value; this.value=''; this.value=v">
        </div>
        <div class="groupCountry">` +
        components.reduce(
          (ac, component) => ac += 
          `
          <button type="button" class="showproducts"   componentid="${component.paisesId}" title="showproducts"  > ${component.name} </button>
          `, 
          "") +  
          '</div>';
      };


      // <span class="nobr"><input type="text" class="search" value="${this.search}" placeholder="Search" onfocus="let v=this.value; this.value=''; this.value=v"> <img class="dsearch" title="Clean Search" src="public/icon_delete.png"/></span>

      ComponentsVC.prototype.productsList = function(productos, user_permissions, paisid) {
        if(!user_permissions)
        return `
        <div class="barraBuscador">
                <button class="btn-search dsearchProduct" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                </svg>
                </button>
                <input type="text" class="searchProduct" paisid="${paisid}" value="${this.searchProduct}" placeholder="Búscar producto..." onfocus="let v=this.value; this.value=''; this.value=v">
        </div>
        <div class="groupProduct">
        ` +
        productos.reduce(
          (ac, producto) => ac += 
          `<div class="oneProduct">
          <label>${producto.name}</label>
          <hr>
          <label>${producto.price} €</label>
          </div>\n`, 
          "")+  
          '</div>';
        else
        return `
        <div class="barraBuscador">
                <button class="btn-search dsearchProduct" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                </svg>
                </button>
                <input type="text" class="searchProduct" paisid="${paisid}" value="${this.searchProduct}" placeholder="Búscar producto..." onfocus="let v=this.value; this.value=''; this.value=v">
        </div>
        <div class=groupProduct>
        ` +
        productos.reduce(
          (ac, producto) => ac += 
          `<div class="oneProductEdit">
          <label>${producto.name}</label>
          <hr>
          <label>${producto.price} €</label>
          <br>
          <button type="button" class="editproducto" paisid=${paisid} productoid="${producto.id}" title="editproducto"  >Edit</button>
          </div>`, 
          "")+  
          '</div>';
      };

      ComponentsVC.prototype.loginForm = function() {
        return `
       <label for="username">Nombre de usuario:</label><br>
       <input type="text" id="username" name="username"><br>
       <label for="password">Contraseña:</label><br>
       <input type="password" id="password" name="password"><br><br>
       <input class="submit enviar_info" type="submit" value="Iniciar sesión">
        `
      };
    
      ComponentsVC.prototype.editProduct = function(producto, paisid) {
        return `
       <h1>Editar el precio de ${producto.name}</h1>
       <label for="new_price">Precio nuevo de ${producto.name}:</label><br>
       <input type="number" id="new_price" name="new_price"><br>
       <input class="edit_product_submit enviar_info" type="submit" paisid=${paisid} productoid=${producto.id} value="Modificar precio">
        `
      };

      ComponentsVC.prototype.countriesController = function() {
        $('#mainpage').hide();
        let where = {};
        if (this.search)
          where.country = [this.search];
        let params = [where];
        $.ajax({
          dataType: "json",
          url: this.url+'/paises',
          data: {params: JSON.stringify(params)}
        })
        .then(r1 => {
          let paises = r1.message;
          $(this.id).html(this.countriesList(paises));
          if (this.search) $(this.id+' .search').focus();
        })
        .catch(error => {console.error(error.status, error.responseText);});
      };
      
      ComponentsVC.prototype.editProductController = function(id, paisid) {
        $.ajax({
          dataType: "json",
          url: this.url+'/product/'+id,
        })
        .then(r1 => {
          let product = r1.message;
          $(this.id).html(this.editProduct(product, paisid));
        })
        .catch(error => {console.error(error.status, error.responseText);});
      }

      ComponentsVC.prototype.submitEditProductController = function(id, paisid) {
        let price = $(this.id+' input[name=new_price]').val();
        $.ajax({
          dataType: "json",
          method: "POST",
          url: this.url + '/paises/'+paisid+'/product',
          data: {id, price}
        })
        .then(() => {
          this.productsController(paisid, this.userId);
        })
        .catch(error => {console.error(error.status, error.responseText);});
      };

      ComponentsVC.prototype.loginController = function() {
        $('#mainpage').show();
        $(this.id).html(this.loginForm());
      };
      ComponentsVC.prototype.logoutController = function() {
        this.userId=null;
        $('#login').show();
        $('#logout').hide();  
        this.countriesController();
      };

      ComponentsVC.prototype.goBackController = function() {
        this.countriesController();
      };

      ComponentsVC.prototype.productsController = function(id, user_id) {
        $('#mainpage').show();
        let where = {};
        if (this.searchProduct)
          where.product = [this.searchProduct];
        let params = [where];
        let p1 = $.ajax({
          dataType: "json",
          url: this.url + '/paises/' + id,
          data: {params: JSON.stringify(params)}
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
          $(this.id).html(this.productsList(productos, user_permissions, id));
          if (this.searchProduct) $(this.id+' .searchProduct').focus();
        })
        .catch(error => {console.error(error.status, error.responseText);});
      };

      ComponentsVC.prototype.submitController = function() {
        let user = $(this.id+' input[name=username]').val();
        let password = $(this.id+' input[name=password]').val();
        $.ajax({
          dataType: "json",
          method: "POST",
          url: this.url,
          data: {user, password}
        })
        .then(r => {
          this.userId=r.message;
          $('#login').hide();
          $('#logout').show();
          this.countriesController();
        })
        .catch(error => {console.error(error.status, error.responseText)}) 
      };


      ComponentsVC.prototype.eventsController = function() {
        $(document).on('click', this.id+' .showproducts',   (e)=> this.productsController(Number($(e.currentTarget).attr('componentid')), this.userId));
        $(document).on('input', this.id+' .search', () => {this.search = $(this.id+' .search').val(); this.countriesController();});
        $(document).on('click', this.id+' .dsearch',() => {this.search = ''; this.countriesController();});
        $(document).on('input', this.id+' .searchProduct', (e) => {this.searchProduct = $(this.id+' .searchProduct').val(); this.productsController(Number($(e.currentTarget).attr('paisid')), this.userId);});
        $(document).on('click', this.id+' .dsearchProduct',(e) => {this.searchProduct = ''; this.productsController(Number($(e.currentTarget).attr('paisid')), this.userId);});
        $(document).on('click', '.login', () => this.loginController());
        $(document).on('click', '.goback', () => this.goBackController());
        $(document).on('click', this.id+' .submit', () => this.submitController());
        $(document).on('click', this.id+' .editproducto', (e) => this.editProductController(Number($(e.currentTarget).attr('productoid')), Number($(e.currentTarget).attr('paisid'))));
        $(document).on('click', this.id+' .edit_product_submit', (e) => this.submitEditProductController(Number($(e.currentTarget).attr('productoid')), Number($(e.currentTarget).attr('paisid'))));
        $(document).on('click', '.logout', () => this.logoutController());
        
      };
      
      $('#mainpage').hide();
      $('#logout').hide();
      this.countriesController();
      this.eventsController();     
    }
    
    
    // Creation of an object View-Controller for the tasks
    let components_vc = new ComponentsVC('http://localhost:8000');
    });