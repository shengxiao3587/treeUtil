import React from 'react';
import { Tree } from 'antd';

const TreeNode = Tree.TreeNode;

export const renderTreeNodes = (data) =>
  data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.menuName} key={item.menuId}>
          {renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode title={item.menuName} key={item.menuId} />;
  });

export const permissionToCheckedKeys = (list, checkedKeys) => {
  list.map((item) => {
    if (item.children && item.children.length > 0) {
      permissionToCheckedKeys(item.children, checkedKeys);
    } else if (item.selected === true) {
      checkedKeys.push(item.menuId);
    }
    return true;
  });
  return checkedKeys;
};

// 判断keys列表中是否存在当前key
const havaKey = (key, keys) => {
  let isHave = false;
  keys.map((item) => {
    if (item === key) {
      isHave = true;
    }
    return true;
  });
  return isHave;
};

// 将keys列表中存在的key对应的selected置为true
const changeSelected = (keys, list) => {
  const newList = [...list];
  newList.map((item) => {
    item.selected = havaKey(item.menuId, keys);
    if (item.children) {
      changeSelected(keys, item.children);
    }
    return true;
  });
  return newList;
};

// 判断子节点是否选中
const ChildrenSelected = (list, selected) => {
  let newSelected = selected;
  for (let i = 0; i < list.length; i += 1) {
    if (list[i].children && list[i].children.length > 0) {
      newSelected = ChildrenSelected(list[i].children, newSelected);
      if (newSelected === true) {
        break;
      }
    } else if (list[i].selected === true) {
      newSelected = true;
      break;
    }
  }
  return newSelected;
};
const changeParentSelected = (list) => {
  const newList = [...list];
  newList.map((item) => {
    if (item.children && item.children.length > 0) {
      item.selected = ChildrenSelected(item.children, false);
      changeParentSelected(item.children);
    }
    return true;
  });
  return newList;
};
export const checkedKeysToPermission = (keys, list) => {
  let newList = changeSelected(keys, list);
  newList = changeParentSelected(newList);
  return newList;
};

