/* Reusable dialog with deferreds
   *
   * Example:
   * $.modalConfirmation()
   *    .then(function() { console.log('success'); })
   *    .fail(function() { console.log('failure'); })
   */

function ModalConfirmation() {
   var self = this;
   var htmlContent;
   
   self.confirm = function (html, cbSucceed, cbFail) {
      htmlContent = html;
      cbSucceed = cbSucceed || function () {;};
      cbFail = cbFail || function () {;};
      modalConfirmation().then(cbSucceed).fail(cbFail);
   }
   
   var modalConfirmation = (function() {
      var $dialog = $('<div id="confirmation" title="Confirm action" style="display: none;">').dialog({
         autoOpen: false,
         modal: true
      });
      var showDialog = function() {
         var def = $.Deferred();
         $dialog.html(htmlContent);
         $dialog.dialog('option', 'buttons',
         {
            "OK": function() {
               def.resolve();
               $(this).dialog('close');
            },
            "Cancel": function() {
               def.reject();
               $(this).dialog('close');
            }
         });
         $dialog.dialog('open');
         return def.promise();
      };
    return showDialog;
  })();
}