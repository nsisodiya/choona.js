/**
 * Copyright 2013-14 Narendra Sisodiya, <narendra@narendrasisodiya.com>
 *
 * Licensed under "The MIT License". visit http://nsisodiya.mit-license.org/ to read the License.
 *
 */

/**
 * choona.Modal
 * We use Plain JavaScript Objects as modal,
 * You can subscribe/publish events on any modal
 *
 * @author Narendra Sisodiya
 */


(function() {
  "use strict";
  choona.Model = choona.EventBus.extend({
    initialize: function() {
      choona.EventBus.call(this);
    },
    publishModalChanges: function() {
      this.publish("change");
    }
  });
})();
