
// tslint:disable: object-literal-key-quotes
const schema = {
  "version": "tynder/1.0",
  "ns": {
    ".": {
      "AppID": {
        "kind": "one-of",
        "oneOf": [
          {
            "kind": "primitive",
            "primitiveName": "string"
          },
          {
            "kind": "primitive",
            "primitiveName": "number"
          }
        ],
        "typeName": "AppID",
        "name": "AppID"
      },
      "RecordID": {
        "kind": "one-of",
        "oneOf": [
          {
            "kind": "primitive",
            "primitiveName": "string"
          },
          {
            "kind": "primitive",
            "primitiveName": "number"
          }
        ],
        "typeName": "RecordID",
        "name": "RecordID"
      },
      "Revision": {
        "kind": "one-of",
        "oneOf": [
          {
            "kind": "primitive",
            "primitiveName": "string"
          },
          {
            "kind": "primitive",
            "primitiveName": "number"
          }
        ],
        "typeName": "Revision",
        "name": "Revision"
      },
      "Lang": {
        "kind": "one-of",
        "oneOf": [
          {
            "kind": "primitive-value",
            "value": "ja"
          },
          {
            "kind": "primitive-value",
            "value": "en"
          },
          {
            "kind": "primitive-value",
            "value": "zh"
          },
          {
            "kind": "primitive-value",
            "value": "user"
          },
          {
            "kind": "primitive-value",
            "value": "default"
          }
        ],
        "typeName": "Lang",
        "name": "Lang"
      },
      "MetaSettings": {
        "kind": "object",
        "members": [
          [
            "name",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "name"
            }
          ],
          [
            "description",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "description"
            }
          ],
          [
            "icon",
            {
              "kind": "one-of",
              "oneOf": [
                {
                  "kind": "object",
                  "members": [
                    [
                      "type",
                      {
                        "kind": "primitive-value",
                        "value": "FILE",
                        "name": "type"
                      }
                    ],
                    [
                      "file",
                      {
                        "kind": "object",
                        "members": [
                          [
                            "contentType",
                            {
                              "kind": "primitive",
                              "primitiveName": "string",
                              "name": "contentType"
                            }
                          ],
                          [
                            "fileKey",
                            {
                              "kind": "primitive",
                              "primitiveName": "string",
                              "name": "fileKey"
                            }
                          ],
                          [
                            "name",
                            {
                              "kind": "primitive",
                              "primitiveName": "string",
                              "name": "name"
                            }
                          ],
                          [
                            "size",
                            {
                              "kind": "primitive",
                              "primitiveName": "string",
                              "name": "size"
                            }
                          ]
                        ],
                        "name": "file"
                      }
                    ]
                  ]
                },
                {
                  "kind": "object",
                  "members": [
                    [
                      "type",
                      {
                        "kind": "primitive-value",
                        "value": "PRESET",
                        "name": "type"
                      }
                    ],
                    [
                      "key",
                      {
                        "kind": "primitive",
                        "primitiveName": "string",
                        "name": "key"
                      }
                    ]
                  ]
                }
              ],
              "name": "icon"
            }
          ],
          [
            "theme",
            {
              "kind": "one-of",
              "oneOf": [
                {
                  "kind": "primitive-value",
                  "value": "WHITE"
                },
                {
                  "kind": "primitive-value",
                  "value": "CLIPBOARD"
                },
                {
                  "kind": "primitive-value",
                  "value": "BINDER"
                },
                {
                  "kind": "primitive-value",
                  "value": "PENCIL"
                },
                {
                  "kind": "primitive-value",
                  "value": "CLIPS"
                },
                {
                  "kind": "primitive-value",
                  "value": "RED"
                },
                {
                  "kind": "primitive-value",
                  "value": "BLUE"
                },
                {
                  "kind": "primitive-value",
                  "value": "GREEN"
                },
                {
                  "kind": "primitive-value",
                  "value": "YELLOW"
                },
                {
                  "kind": "primitive-value",
                  "value": "BLACK"
                }
              ],
              "name": "theme"
            }
          ],
          [
            "revision",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "revision"
            }
          ]
        ],
        "typeName": "MetaSettings",
        "name": "MetaSettings"
      },
      "AssigneeEntity": {
        "kind": "object",
        "members": [
          [
            "entity",
            {
              "kind": "one-of",
              "oneOf": [
                {
                  "kind": "object",
                  "members": [
                    [
                      "type",
                      {
                        "kind": "one-of",
                        "oneOf": [
                          {
                            "kind": "primitive-value",
                            "value": "USER"
                          },
                          {
                            "kind": "primitive-value",
                            "value": "GROUP"
                          },
                          {
                            "kind": "primitive-value",
                            "value": "ORGANIZATION"
                          },
                          {
                            "kind": "primitive-value",
                            "value": "FIELD_ENTITY"
                          },
                          {
                            "kind": "primitive-value",
                            "value": "CUSTOM_FIELD"
                          }
                        ],
                        "name": "type"
                      }
                    ],
                    [
                      "code",
                      {
                        "kind": "primitive",
                        "primitiveName": "string",
                        "name": "code"
                      }
                    ]
                  ]
                },
                {
                  "kind": "object",
                  "members": [
                    [
                      "type",
                      {
                        "kind": "primitive-value",
                        "value": "CREATOR",
                        "name": "type"
                      }
                    ],
                    [
                      "code",
                      {
                        "kind": "optional",
                        "optional": {
                          "kind": "primitive",
                          "primitiveName": "null"
                        },
                        "name": "code"
                      }
                    ]
                  ]
                }
              ],
              "name": "entity"
            }
          ],
          [
            "includeSubs",
            {
              "kind": "primitive",
              "primitiveName": "boolean",
              "name": "includeSubs"
            }
          ]
        ],
        "typeName": "AssigneeEntity",
        "name": "AssigneeEntity"
      },
      "State": {
        "kind": "object",
        "members": [
          [
            "index",
            {
              "kind": "one-of",
              "oneOf": [
                {
                  "kind": "primitive",
                  "primitiveName": "string"
                },
                {
                  "kind": "primitive",
                  "primitiveName": "number"
                }
              ],
              "name": "index"
            }
          ],
          [
            "name",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "name"
            }
          ],
          [
            "assignee",
            {
              "kind": "object",
              "members": [
                [
                  "type",
                  {
                    "kind": "one-of",
                    "oneOf": [
                      {
                        "kind": "primitive-value",
                        "value": "ONE"
                      },
                      {
                        "kind": "primitive-value",
                        "value": "ALL"
                      },
                      {
                        "kind": "primitive-value",
                        "value": "ANY"
                      }
                    ],
                    "name": "type"
                  }
                ],
                [
                  "entities",
                  {
                    "kind": "repeated",
                    "min": null,
                    "max": null,
                    "repeated": {
                      "kind": "symlink",
                      "symlinkTargetName": "AssigneeEntity",
                      "typeName": "AssigneeEntity",
                      "name": "AssigneeEntity"
                    },
                    "name": "entities"
                  }
                ]
              ],
              "name": "assignee"
            }
          ]
        ],
        "typeName": "State",
        "name": "State"
      },
      "Action": {
        "kind": "object",
        "members": [
          [
            "name",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "name"
            }
          ],
          [
            "from",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "from"
            }
          ],
          [
            "to",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "to"
            }
          ],
          [
            "filterCond",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "filterCond"
            }
          ]
        ],
        "typeName": "Action",
        "name": "Action"
      },
      "MetaStatus": {
        "kind": "object",
        "members": [
          [
            "enable",
            {
              "kind": "optional",
              "optional": {
                "kind": "one-of",
                "oneOf": [
                  {
                    "kind": "primitive",
                    "primitiveName": "boolean"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "null"
                  }
                ]
              },
              "name": "enable"
            }
          ],
          [
            "states",
            {
              "kind": "optional",
              "optional": {
                "kind": "one-of",
                "oneOf": [
                  {
                    "kind": "object",
                    "members": [],
                    "additionalProps": [
                      [
                        [
                          "string"
                        ],
                        {
                          "kind": "symlink",
                          "symlinkTargetName": "State",
                          "typeName": "State",
                          "name": "State"
                        }
                      ]
                    ]
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "null"
                  }
                ]
              },
              "name": "states"
            }
          ],
          [
            "actions",
            {
              "kind": "optional",
              "optional": {
                "kind": "one-of",
                "oneOf": [
                  {
                    "kind": "repeated",
                    "min": null,
                    "max": null,
                    "repeated": {
                      "kind": "symlink",
                      "symlinkTargetName": "Action",
                      "typeName": "Action",
                      "name": "Action"
                    }
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "null"
                  }
                ]
              },
              "name": "actions"
            }
          ],
          [
            "revision",
            {
              "kind": "optional",
              "optional": {
                "kind": "symlink",
                "symlinkTargetName": "Revision",
                "typeName": "Revision",
                "name": "Revision"
              },
              "typeName": "Revision",
              "name": "revision"
            }
          ]
        ],
        "typeName": "MetaStatus",
        "name": "MetaStatus"
      },
      "FieldBase": {
        "kind": "object",
        "members": [
          [
            "code",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "code"
            }
          ],
          [
            "label",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "label"
            }
          ]
        ],
        "typeName": "FieldBase",
        "name": "FieldBase"
      },
      "StatusField": {
        "kind": "object",
        "members": [
          [
            "type",
            {
              "kind": "primitive-value",
              "value": "STATUS",
              "isRecordTypeField": true,
              "name": "type"
            }
          ]
        ],
        "typeName": "StatusField",
        "name": "StatusField"
      },
      "StatusAssigneeField": {
        "kind": "object",
        "members": [
          [
            "type",
            {
              "kind": "primitive-value",
              "value": "STATUS_ASSIGNEE",
              "isRecordTypeField": true,
              "name": "type"
            }
          ]
        ],
        "typeName": "StatusAssigneeField",
        "name": "StatusAssigneeField"
      },
      "Field": {
        "kind": "one-of",
        "oneOf": [
          {
            "kind": "symlink",
            "symlinkTargetName": "StatusField",
            "typeName": "StatusField",
            "name": "StatusField"
          },
          {
            "kind": "symlink",
            "symlinkTargetName": "StatusAssigneeField",
            "typeName": "StatusAssigneeField",
            "name": "StatusAssigneeField"
          }
        ],
        "typeName": "Field",
        "name": "Field"
      },
      "MetaFields": {
        "kind": "object",
        "members": [
          [
            "properties",
            {
              "kind": "object",
              "members": [],
              "additionalProps": [
                [
                  [
                    "string"
                  ],
                  {
                    "kind": "object",
                    "members": []
                  }
                ]
              ],
              "name": "properties"
            }
          ],
          [
            "revision",
            {
              "kind": "optional",
              "optional": {
                "kind": "symlink",
                "symlinkTargetName": "Revision",
                "typeName": "Revision",
                "name": "Revision"
              },
              "typeName": "Revision",
              "name": "revision"
            }
          ]
        ],
        "typeName": "MetaFields",
        "name": "MetaFields"
      },
      "MetaLayout": {
        "kind": "object",
        "members": [
          [
            "layout",
            {
              "kind": "repeated",
              "min": null,
              "max": null,
              "repeated": {
                "kind": "object",
                "members": []
              },
              "name": "layout"
            }
          ],
          [
            "revision",
            {
              "kind": "optional",
              "optional": {
                "kind": "symlink",
                "symlinkTargetName": "Revision",
                "typeName": "Revision",
                "name": "Revision"
              },
              "typeName": "Revision",
              "name": "revision"
            }
          ]
        ],
        "typeName": "MetaLayout",
        "name": "MetaLayout"
      },
      "ViewBase": {
        "kind": "object",
        "members": [
          [
            "index",
            {
              "kind": "one-of",
              "oneOf": [
                {
                  "kind": "primitive",
                  "primitiveName": "string"
                },
                {
                  "kind": "primitive",
                  "primitiveName": "number"
                }
              ],
              "name": "index"
            }
          ],
          [
            "builtinType",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive-value",
                "value": "ASSIGNEE"
              },
              "name": "builtinType"
            }
          ],
          [
            "id",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "id"
            }
          ],
          [
            "name",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "name"
            }
          ],
          [
            "filterCond",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "filterCond"
            }
          ],
          [
            "sort",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "sort"
            }
          ]
        ],
        "typeName": "ViewBase",
        "name": "ViewBase"
      },
      "ListView": {
        "kind": "object",
        "members": [
          [
            "type",
            {
              "kind": "primitive-value",
              "value": "LIST",
              "isRecordTypeField": true,
              "name": "type"
            }
          ],
          [
            "fields",
            {
              "kind": "repeated",
              "min": null,
              "max": null,
              "repeated": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "fields"
            }
          ],
          [
            "index",
            {
              "kind": "one-of",
              "oneOf": [
                {
                  "kind": "primitive",
                  "primitiveName": "string"
                },
                {
                  "kind": "primitive",
                  "primitiveName": "number"
                }
              ],
              "name": "index"
            },
            true
          ],
          [
            "builtinType",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive-value",
                "value": "ASSIGNEE"
              },
              "name": "builtinType"
            },
            true
          ],
          [
            "id",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "id"
            },
            true
          ],
          [
            "name",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "name"
            },
            true
          ],
          [
            "filterCond",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "filterCond"
            },
            true
          ],
          [
            "sort",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "sort"
            },
            true
          ]
        ],
        "baseTypes": [
          {
            "kind": "symlink",
            "symlinkTargetName": "ViewBase",
            "typeName": "ViewBase",
            "name": "ViewBase"
          }
        ],
        "typeName": "ListView",
        "name": "ListView"
      },
      "CalendarView": {
        "kind": "object",
        "members": [
          [
            "type",
            {
              "kind": "primitive-value",
              "value": "CALENDAR",
              "isRecordTypeField": true,
              "name": "type"
            }
          ],
          [
            "date",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "date"
            }
          ],
          [
            "title",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "title"
            }
          ],
          [
            "index",
            {
              "kind": "one-of",
              "oneOf": [
                {
                  "kind": "primitive",
                  "primitiveName": "string"
                },
                {
                  "kind": "primitive",
                  "primitiveName": "number"
                }
              ],
              "name": "index"
            },
            true
          ],
          [
            "builtinType",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive-value",
                "value": "ASSIGNEE"
              },
              "name": "builtinType"
            },
            true
          ],
          [
            "id",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "id"
            },
            true
          ],
          [
            "name",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "name"
            },
            true
          ],
          [
            "filterCond",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "filterCond"
            },
            true
          ],
          [
            "sort",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "sort"
            },
            true
          ]
        ],
        "baseTypes": [
          {
            "kind": "symlink",
            "symlinkTargetName": "ViewBase",
            "typeName": "ViewBase",
            "name": "ViewBase"
          }
        ],
        "typeName": "CalendarView",
        "name": "CalendarView"
      },
      "CustomView": {
        "kind": "object",
        "members": [
          [
            "type",
            {
              "kind": "primitive-value",
              "value": "CUSTOM",
              "isRecordTypeField": true,
              "name": "type"
            }
          ],
          [
            "html",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "html"
            }
          ],
          [
            "pager",
            {
              "kind": "primitive",
              "primitiveName": "boolean",
              "name": "pager"
            }
          ],
          [
            "device",
            {
              "kind": "one-of",
              "oneOf": [
                {
                  "kind": "primitive-value",
                  "value": "DESKTOP"
                },
                {
                  "kind": "primitive-value",
                  "value": "ANY"
                }
              ],
              "name": "device"
            }
          ],
          [
            "index",
            {
              "kind": "one-of",
              "oneOf": [
                {
                  "kind": "primitive",
                  "primitiveName": "string"
                },
                {
                  "kind": "primitive",
                  "primitiveName": "number"
                }
              ],
              "name": "index"
            },
            true
          ],
          [
            "builtinType",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive-value",
                "value": "ASSIGNEE"
              },
              "name": "builtinType"
            },
            true
          ],
          [
            "id",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "id"
            },
            true
          ],
          [
            "name",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "name"
            },
            true
          ],
          [
            "filterCond",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "filterCond"
            },
            true
          ],
          [
            "sort",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "sort"
            },
            true
          ]
        ],
        "baseTypes": [
          {
            "kind": "symlink",
            "symlinkTargetName": "ViewBase",
            "typeName": "ViewBase",
            "name": "ViewBase"
          }
        ],
        "typeName": "CustomView",
        "name": "CustomView"
      },
      "View": {
        "kind": "one-of",
        "oneOf": [
          {
            "kind": "symlink",
            "symlinkTargetName": "ListView",
            "typeName": "ListView",
            "name": "ListView"
          },
          {
            "kind": "symlink",
            "symlinkTargetName": "CalendarView",
            "typeName": "CalendarView",
            "name": "CalendarView"
          },
          {
            "kind": "symlink",
            "symlinkTargetName": "CustomView",
            "typeName": "CustomView",
            "name": "CustomView"
          }
        ],
        "typeName": "View",
        "name": "View"
      },
      "MetaViews": {
        "kind": "object",
        "members": [
          [
            "views",
            {
              "kind": "object",
              "members": [],
              "additionalProps": [
                [
                  [
                    "string"
                  ],
                  {
                    "kind": "symlink",
                    "symlinkTargetName": "View",
                    "typeName": "View",
                    "name": "View"
                  }
                ]
              ],
              "name": "views"
            }
          ],
          [
            "revision",
            {
              "kind": "optional",
              "optional": {
                "kind": "symlink",
                "symlinkTargetName": "Revision",
                "typeName": "Revision",
                "name": "Revision"
              },
              "typeName": "Revision",
              "name": "revision"
            }
          ]
        ],
        "typeName": "MetaViews",
        "name": "MetaViews"
      },
      "AppRightEntity": {
        "kind": "object",
        "members": [
          [
            "entity",
            {
              "kind": "one-of",
              "oneOf": [
                {
                  "kind": "object",
                  "members": [
                    [
                      "type",
                      {
                        "kind": "one-of",
                        "oneOf": [
                          {
                            "kind": "primitive-value",
                            "value": "USER"
                          },
                          {
                            "kind": "primitive-value",
                            "value": "GROUP"
                          },
                          {
                            "kind": "primitive-value",
                            "value": "ORGANIZATION"
                          }
                        ],
                        "name": "type"
                      }
                    ],
                    [
                      "code",
                      {
                        "kind": "primitive",
                        "primitiveName": "string",
                        "name": "code"
                      }
                    ]
                  ]
                },
                {
                  "kind": "object",
                  "members": [
                    [
                      "type",
                      {
                        "kind": "primitive-value",
                        "value": "CREATOR",
                        "name": "type"
                      }
                    ],
                    [
                      "code",
                      {
                        "kind": "primitive",
                        "primitiveName": "null",
                        "name": "code"
                      }
                    ]
                  ]
                }
              ],
              "name": "entity"
            }
          ],
          [
            "includeSubs",
            {
              "kind": "primitive",
              "primitiveName": "boolean",
              "name": "includeSubs"
            }
          ],
          [
            "appEditable",
            {
              "kind": "primitive",
              "primitiveName": "boolean",
              "name": "appEditable"
            }
          ],
          [
            "recordViewable",
            {
              "kind": "primitive",
              "primitiveName": "boolean",
              "name": "recordViewable"
            }
          ],
          [
            "recordAddable",
            {
              "kind": "primitive",
              "primitiveName": "boolean",
              "name": "recordAddable"
            }
          ],
          [
            "recordEditable",
            {
              "kind": "primitive",
              "primitiveName": "boolean",
              "name": "recordEditable"
            }
          ],
          [
            "recordDeletable",
            {
              "kind": "primitive",
              "primitiveName": "boolean",
              "name": "recordDeletable"
            }
          ],
          [
            "recordImportable",
            {
              "kind": "primitive",
              "primitiveName": "boolean",
              "name": "recordImportable"
            }
          ],
          [
            "recordExportable",
            {
              "kind": "primitive",
              "primitiveName": "boolean",
              "name": "recordExportable"
            }
          ]
        ],
        "typeName": "AppRightEntity",
        "name": "AppRightEntity"
      },
      "MetaAclApp": {
        "kind": "object",
        "members": [
          [
            "rights",
            {
              "kind": "repeated",
              "min": null,
              "max": null,
              "repeated": {
                "kind": "symlink",
                "symlinkTargetName": "AppRightEntity",
                "typeName": "AppRightEntity",
                "name": "AppRightEntity"
              },
              "name": "rights"
            }
          ],
          [
            "revision",
            {
              "kind": "optional",
              "optional": {
                "kind": "symlink",
                "symlinkTargetName": "Revision",
                "typeName": "Revision",
                "name": "Revision"
              },
              "typeName": "Revision",
              "name": "revision"
            }
          ]
        ],
        "typeName": "MetaAclApp",
        "name": "MetaAclApp"
      },
      "FieldRightEntity": {
        "kind": "object",
        "members": [
          [
            "accessibility",
            {
              "kind": "one-of",
              "oneOf": [
                {
                  "kind": "primitive-value",
                  "value": "READ"
                },
                {
                  "kind": "primitive-value",
                  "value": "WRITE"
                },
                {
                  "kind": "primitive-value",
                  "value": "NONE"
                }
              ],
              "name": "accessibility"
            }
          ],
          [
            "entity",
            {
              "kind": "object",
              "members": [
                [
                  "code",
                  {
                    "kind": "primitive",
                    "primitiveName": "string",
                    "name": "code"
                  }
                ],
                [
                  "type",
                  {
                    "kind": "one-of",
                    "oneOf": [
                      {
                        "kind": "primitive-value",
                        "value": "USER"
                      },
                      {
                        "kind": "primitive-value",
                        "value": "GROUP"
                      },
                      {
                        "kind": "primitive-value",
                        "value": "ORGANIZATION"
                      },
                      {
                        "kind": "primitive-value",
                        "value": "FIELD_ENTITY"
                      }
                    ],
                    "name": "type"
                  }
                ]
              ],
              "name": "entity"
            }
          ],
          [
            "includeSubs",
            {
              "kind": "primitive",
              "primitiveName": "boolean",
              "name": "includeSubs"
            }
          ]
        ],
        "typeName": "FieldRightEntity",
        "name": "FieldRightEntity"
      },
      "FieldRight": {
        "kind": "object",
        "members": [
          [
            "code",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "code"
            }
          ],
          [
            "entities",
            {
              "kind": "repeated",
              "min": null,
              "max": null,
              "repeated": {
                "kind": "symlink",
                "symlinkTargetName": "FieldRightEntity",
                "typeName": "FieldRightEntity",
                "name": "FieldRightEntity"
              },
              "name": "entities"
            }
          ]
        ],
        "typeName": "FieldRight",
        "name": "FieldRight"
      },
      "MetaAclField": {
        "kind": "object",
        "members": [
          [
            "rights",
            {
              "kind": "repeated",
              "min": null,
              "max": null,
              "repeated": {
                "kind": "symlink",
                "symlinkTargetName": "FieldRight",
                "typeName": "FieldRight",
                "name": "FieldRight"
              },
              "name": "rights"
            }
          ],
          [
            "revision",
            {
              "kind": "optional",
              "optional": {
                "kind": "symlink",
                "symlinkTargetName": "Revision",
                "typeName": "Revision",
                "name": "Revision"
              },
              "typeName": "Revision",
              "name": "revision"
            }
          ]
        ],
        "typeName": "MetaAclField",
        "name": "MetaAclField"
      },
      "RecordRightEntity": {
        "kind": "object",
        "members": [
          [
            "entity",
            {
              "kind": "object",
              "members": [
                [
                  "code",
                  {
                    "kind": "primitive",
                    "primitiveName": "string",
                    "name": "code"
                  }
                ],
                [
                  "type",
                  {
                    "kind": "one-of",
                    "oneOf": [
                      {
                        "kind": "primitive-value",
                        "value": "USER"
                      },
                      {
                        "kind": "primitive-value",
                        "value": "GROUP"
                      },
                      {
                        "kind": "primitive-value",
                        "value": "ORGANIZATION"
                      },
                      {
                        "kind": "primitive-value",
                        "value": "FIELD_ENTITY"
                      }
                    ],
                    "name": "type"
                  }
                ]
              ],
              "name": "entity"
            }
          ],
          [
            "viewable",
            {
              "kind": "primitive",
              "primitiveName": "boolean",
              "name": "viewable"
            }
          ],
          [
            "editable",
            {
              "kind": "primitive",
              "primitiveName": "boolean",
              "name": "editable"
            }
          ],
          [
            "deletable",
            {
              "kind": "primitive",
              "primitiveName": "boolean",
              "name": "deletable"
            }
          ],
          [
            "includeSubs",
            {
              "kind": "primitive",
              "primitiveName": "boolean",
              "name": "includeSubs"
            }
          ]
        ],
        "typeName": "RecordRightEntity",
        "name": "RecordRightEntity"
      },
      "RecordRight": {
        "kind": "object",
        "members": [
          [
            "entities",
            {
              "kind": "repeated",
              "min": null,
              "max": null,
              "repeated": {
                "kind": "symlink",
                "symlinkTargetName": "RecordRightEntity",
                "typeName": "RecordRightEntity",
                "name": "RecordRightEntity"
              },
              "name": "entities"
            }
          ],
          [
            "filterCond",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "filterCond"
            }
          ]
        ],
        "typeName": "RecordRight",
        "name": "RecordRight"
      },
      "MetaAclRecord": {
        "kind": "object",
        "members": [
          [
            "rights",
            {
              "kind": "repeated",
              "min": null,
              "max": null,
              "repeated": {
                "kind": "symlink",
                "symlinkTargetName": "RecordRight",
                "typeName": "RecordRight",
                "name": "RecordRight"
              },
              "name": "rights"
            }
          ],
          [
            "revision",
            {
              "kind": "optional",
              "optional": {
                "kind": "symlink",
                "symlinkTargetName": "Revision",
                "typeName": "Revision",
                "name": "Revision"
              },
              "typeName": "Revision",
              "name": "revision"
            }
          ]
        ],
        "typeName": "MetaAclRecord",
        "name": "MetaAclRecord"
      },
      "AppCustomizeScope": {
        "kind": "one-of",
        "oneOf": [
          {
            "kind": "primitive-value",
            "value": "ALL"
          },
          {
            "kind": "primitive-value",
            "value": "ADMIN"
          },
          {
            "kind": "primitive-value",
            "value": "NONE"
          }
        ],
        "typeName": "AppCustomizeScope",
        "name": "AppCustomizeScope"
      },
      "AppCustomizeResource": {
        "kind": "one-of",
        "oneOf": [
          {
            "kind": "object",
            "members": [
              [
                "type",
                {
                  "kind": "primitive-value",
                  "value": "URL",
                  "name": "type"
                }
              ],
              [
                "url",
                {
                  "kind": "primitive",
                  "primitiveName": "string",
                  "name": "url"
                }
              ]
            ]
          },
          {
            "kind": "object",
            "members": [
              [
                "type",
                {
                  "kind": "primitive-value",
                  "value": "FILE",
                  "name": "type"
                }
              ],
              [
                "file",
                {
                  "kind": "object",
                  "members": [
                    [
                      "fileKey",
                      {
                        "kind": "primitive",
                        "primitiveName": "string",
                        "name": "fileKey"
                      }
                    ],
                    [
                      "name",
                      {
                        "kind": "primitive",
                        "primitiveName": "string",
                        "name": "name"
                      }
                    ],
                    [
                      "contentType",
                      {
                        "kind": "primitive",
                        "primitiveName": "string",
                        "name": "contentType"
                      }
                    ],
                    [
                      "size",
                      {
                        "kind": "primitive",
                        "primitiveName": "string",
                        "name": "size"
                      }
                    ]
                  ],
                  "name": "file"
                }
              ]
            ]
          }
        ],
        "typeName": "AppCustomizeResource",
        "name": "AppCustomizeResource"
      },
      "AppCustomize": {
        "kind": "object",
        "members": [
          [
            "js",
            {
              "kind": "repeated",
              "min": null,
              "max": null,
              "repeated": {
                "kind": "symlink",
                "symlinkTargetName": "AppCustomizeResource",
                "typeName": "AppCustomizeResource",
                "name": "AppCustomizeResource"
              },
              "name": "js"
            }
          ],
          [
            "css",
            {
              "kind": "repeated",
              "min": null,
              "max": null,
              "repeated": {
                "kind": "symlink",
                "symlinkTargetName": "AppCustomizeResource",
                "typeName": "AppCustomizeResource",
                "name": "AppCustomizeResource"
              },
              "name": "css"
            }
          ]
        ],
        "typeName": "AppCustomize",
        "name": "AppCustomize"
      },
      "MetaCustomize": {
        "kind": "object",
        "members": [
          [
            "scope",
            {
              "kind": "optional",
              "optional": {
                "kind": "symlink",
                "symlinkTargetName": "AppCustomizeScope",
                "typeName": "AppCustomizeScope",
                "name": "AppCustomizeScope"
              },
              "typeName": "AppCustomizeScope",
              "name": "scope"
            }
          ],
          [
            "desktop",
            {
              "kind": "optional",
              "optional": {
                "kind": "symlink",
                "symlinkTargetName": "AppCustomize",
                "typeName": "AppCustomize",
                "name": "AppCustomize"
              },
              "typeName": "AppCustomize",
              "name": "desktop"
            }
          ],
          [
            "mobile",
            {
              "kind": "optional",
              "optional": {
                "kind": "symlink",
                "symlinkTargetName": "AppCustomize",
                "typeName": "AppCustomize",
                "name": "AppCustomize"
              },
              "typeName": "AppCustomize",
              "name": "mobile"
            }
          ],
          [
            "revision",
            {
              "kind": "optional",
              "optional": {
                "kind": "symlink",
                "symlinkTargetName": "Revision",
                "typeName": "Revision",
                "name": "Revision"
              },
              "typeName": "Revision",
              "name": "revision"
            }
          ]
        ],
        "typeName": "MetaCustomize",
        "name": "MetaCustomize"
      }
    }
  }
};
export default schema;
// tslint:enable: object-literal-key-quotes
