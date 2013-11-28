// Routes

// TODO import stuff needed by routes here.
// like packages, modules, models.
//

function bindTo(app) {

  <% for(var i = 0; i < routes.length; i ++) { %>
  <% var route = routes[i]; %>
  app.<%= route.method.toLowerCase() %>('<%= route.pattern %>', <%= route.code %>);
  <% } %>

}

exports.bindTo = bindTo;
