import React from "react";
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';


function BreadCrumbC(props) {
  /*
    props = {
      className //For listClassName
      ancestors //Ancestor names
    }
  */

  let breadItems = props.ancestors.reverse().map((ancestor, i, ancestors) => {
    switch (i) {
      case 0:
        return <BreadcrumbItem tag="span" key={"bread_" + i}>Decision Criteria</BreadcrumbItem>;
      case ancestors.length - 1:
        return <BreadcrumbItem tag="span" active key={"bread_" + i}>{ancestor}</BreadcrumbItem>;
      default:
        return <BreadcrumbItem tag="span" key={"bread_" + i}>{ancestor}</BreadcrumbItem>;
    }
  });

  return ( //Use `tag` attribute to use elements other than nav
    <Breadcrumb tag="div" listTag="div" listClassName={props.className}>
      {breadItems}
    </Breadcrumb>
  );
}


export default BreadCrumbC;