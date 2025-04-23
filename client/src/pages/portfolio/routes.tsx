import React from 'react';
import { Route, Switch } from 'wouter';
import Portfolio from './index';

export const PortfolioRoutes = () => {
  return (
    <Switch>
      <Route path="/portfolio" component={Portfolio} />
    </Switch>
  );
};

export default PortfolioRoutes;