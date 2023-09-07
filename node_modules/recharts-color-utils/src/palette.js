import {color, hcl, lab} from 'd3-color';

export default (baseColor, scheme) => {
  const baseHcl = new hcl(new lab(new color(baseColor)));
  let arr = [];

  switch(scheme) {
    case 'complementary': //生成互补色
      arr = [[0,0,0], [180,0,0]];
      break;
    case 'analogous':
      arr = [[0,0,0], [30,0,0], [330,0,0]];
      break;
    case 'split-complementary':
      arr = [[0,0,0], [150,0,0], [210,0,0]];
      break;
    case 'triadic': //生成三色系
      arr = [[0,0,0], [120,0,0], [240,0,0]];
      break;
    case 'rectangle': //生成分散互补色系
      arr = [[0,0,0], [60,0,0], [180,0,0], [240,0,0]];
      break;
    case 'square':
      arr = [[0,0,0], [90,0,0], [180,0,0], [270,0,0]];
      break;
    case 'single':
    default:
      arr = [[0,0,0]];
  }

  return arr.map(
    v => {
      return new hcl(baseHcl.h + v[0], baseHcl.c + v[1], baseHcl.l + v[2]).rgb().toString();
    }
  );
}
