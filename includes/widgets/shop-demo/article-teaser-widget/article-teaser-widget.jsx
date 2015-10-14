/**
 * Copyright 2015 aixigo AG
 * Released under the MIT license.
 * http://www.laxarjs.org
 *
 * compile using
 * > babel -m amd -d . article-teaser-widget.jsx
 */
import React from 'react';
const injections = [ 'axEventBus', 'axFeatures', 'axReactRender' ];
function create( eventBus, features, reactRender ) {
   var resources = {};
   const articleResource = features.article.resource;
   eventBus.subscribe( `didReplace.${articleResource}`, event => {
      resources.article = event.data;
      render();
   } );
   return { onDomAvailable: render };

   function addToCart() {
      const actionName = features.confirmation.action;
      eventBus.publish( `takeActionRequest.${actionName}`, {
         action: actionName } );
   }
   function render() {
      reactRender( <div>
         <ArticleHeader isSelected={ resources.article != null } />
         <ArticleTeaser article={ resources.article } />
         <button onClick={ addToCart } type='button'
                 className={ resources.article || 'ax-disabled' }>
            <i className='fa fa-shopping-cart'></i> Add to Cart</button>
      </div> );
   }
}
export default { name: 'article-teaser-widget', injections, create };



const eventBus = {
   subscribe() {},
   publish() {}
};

const ArticleHeader = React.createClass({
   render() {
      const { isSelected } = this.props;
      return <h3 className={ `ax-function-point ${isSelected ? 'app-selection' : ''}` }>
         <i className='fa fa-search'></i> Details
      </h3>;
   }
});

const ArticleTeaser = React.createClass({

   render() {
      const article = this.props.article || { name: 'No article selected' };
      return <div className={ 'app-teaser-wrapper clearfix' + (article.id && ' app-selection') }>
         <h4 className={ article.id || 'app-no-selection' }>{ article.name }</h4>
         <div className='row'>
            <div className='col col-md-12 app-teaser-image-wrapper'>
               { article.pictureUrl && <img className='app-teaser-image' src={ article.pictureUrl } /> }
            </div>
         </div>
         <div className='row'>
            <div className='col col-md-12'>
               <dl className='dl-horizontal'>
                  <dt data-ng-class={ article.id || 'ax-disabled' }>Art. ID</dt>
                  <dd>{ article.id }</dd>

                  <dt className={ article.id || 'ax-disabled' }>Description</dt>
                  <dd dangerouslySetInnerHTML={{__html: article.htmlDescription}}></dd>

                  <dt className={ article.id || 'ax-disabled' }>Price</dt>
                  <dd>{ this.formattedPrice( article.price ) }</dd>
               </dl>
            </div>
         </div>
      </div>;
   },

   formattedPrice( price ) {
      return price == null ? null : ('€ ' + price.toFixed( 2 ));
   }
});
