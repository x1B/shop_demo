define(['exports', 'module', 'react'], function (exports, module, _react) {
   /**
    * Copyright 2015 aixigo AG
    * Released under the MIT license.
    * http://www.laxarjs.org
    *
    * compile using
    * > babel -m amd -d . article-teaser-widget.jsx
    */
   'use strict';

   function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

   var _React = _interopRequireDefault(_react);

   var injections = ['axEventBus', 'axFeatures', 'axReactRender'];
   function create(eventBus, features, reactRender) {
      var resources = {};
      var articleResource = features.article.resource;
      eventBus.subscribe('didReplace.' + articleResource, function (event) {
         resources.article = event.data;
         render();
      });
      return { onDomAvailable: render };

      function addToCart() {
         var actionName = features.confirmation.action;
         eventBus.publish('takeActionRequest.' + actionName, {
            action: actionName });
      }
      function render() {
         reactRender(_React['default'].createElement(
            'div',
            null,
            _React['default'].createElement(ArticleHeader, { isSelected: resources.article != null }),
            _React['default'].createElement(ArticleTeaser, { article: resources.article }),
            _React['default'].createElement(
               'button',
               { onClick: addToCart, type: 'button',
                  className: 'btn pull-right ' + (resources.article ? 'btn-info' : 'ax-disabled') },
               _React['default'].createElement('i', { className: 'fa fa-shopping-cart' }),
               ' Add to Cart'
            )
         ));
      }
   }
   module.exports = { name: 'article-teaser-widget', injections: injections, create: create };

   var eventBus = {
      subscribe: function subscribe() {},
      publish: function publish() {}
   };

   var ArticleHeader = _React['default'].createClass({
      displayName: 'ArticleHeader',

      render: function render() {
         var isSelected = this.props.isSelected;

         return _React['default'].createElement(
            'h3',
            { className: 'ax-function-point ' + (isSelected ? 'app-selection' : '') },
            _React['default'].createElement('i', { className: 'fa fa-search' }),
            ' Details'
         );
      }
   });

   var ArticleTeaser = _React['default'].createClass({
      displayName: 'ArticleTeaser',

      render: function render() {
         var article = this.props.article || { name: 'No article selected' };
         return _React['default'].createElement(
            'div',
            { className: 'app-teaser-wrapper clearfix' + (article.id && ' app-selection') },
            _React['default'].createElement(
               'h4',
               { className: article.id || 'app-no-selection' },
               article.name
            ),
            _React['default'].createElement(
               'div',
               { className: 'row' },
               _React['default'].createElement(
                  'div',
                  { className: 'col col-md-6' },
                  _React['default'].createElement(
                     'dl',
                     { className: 'dl-horizontal' },
                     _React['default'].createElement(
                        'dt',
                        { 'data-ng-class': article.id || 'ax-disabled' },
                        'Art. ID'
                     ),
                     _React['default'].createElement(
                        'dd',
                        null,
                        article.id
                     ),
                     _React['default'].createElement(
                        'dt',
                        { className: article.id || 'ax-disabled' },
                        'Description'
                     ),
                     _React['default'].createElement('dd', { dangerouslySetInnerHTML: { __html: article.htmlDescription } }),
                     _React['default'].createElement(
                        'dt',
                        { className: article.id || 'ax-disabled' },
                        'Price'
                     ),
                     _React['default'].createElement(
                        'dd',
                        null,
                        this.formattedPrice(article.price)
                     )
                  )
               ),
               _React['default'].createElement(
                  'div',
                  { className: 'col col-md-6 app-teaser-image-wrapper' },
                  article.pictureUrl && _React['default'].createElement('img', { className: 'app-teaser-image', src: article.pictureUrl })
               )
            )
         );
      },

      formattedPrice: function formattedPrice(price) {
         return price == null ? null : '€ ' + price.toFixed(2);
      }
   });
});