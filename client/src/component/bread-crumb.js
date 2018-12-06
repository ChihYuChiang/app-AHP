import React from "react";
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';


function BreadCrumbC(props) {
  /*
    props = {
      ancestors //Ancestor names
    }
  */

  let breadItems = props.ancestors.reverse().map((ancestor, i, ancestors) => {
    if (i + 1 === ancestors.length) {
      return <BreadcrumbItem tag="span" active key={"bread_" + i}>{ancestor}</BreadcrumbItem>;
    }
    else return <BreadcrumbItem tag="span" key={"bread_" + i}>{ancestor}</BreadcrumbItem>
  });

  return ( //Use `tag` attribute to use elements other than nav
    <Breadcrumb tag="div" listTag="div">
      {breadItems}
    </Breadcrumb>
  );
}


export default BreadCrumbC;