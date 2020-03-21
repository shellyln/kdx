
// tslint:disable: object-literal-key-quotes
const schema = {
  "version": "tynder/1.0",
  "ns": {
    ".": {
      "MetaIndex": {
        "kind": "object",
        "members": [
          [
            "apps",
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
                    "members": [],
                    "additionalProps": [
                      [
                        [
                          "string"
                        ],
                        {
                          "kind": "object",
                          "members": [
                            [
                              "appId",
                              {
                                "kind": "primitive",
                                "primitiveName": "number",
                                "name": "appId"
                              }
                            ],
                            [
                              "guestSpaceId",
                              {
                                "kind": "optional",
                                "optional": {
                                  "kind": "primitive",
                                  "primitiveName": "number"
                                },
                                "name": "guestSpaceId"
                              }
                            ],
                            [
                              "preview",
                              {
                                "kind": "primitive",
                                "primitiveName": "boolean",
                                "name": "preview"
                              }
                            ]
                          ]
                        }
                      ]
                    ]
                  }
                ]
              ],
              "name": "apps"
            }
          ]
        ],
        "typeName": "MetaIndex",
        "name": "MetaIndex"
      },
      "MetaHashIndex": {
        "kind": "object",
        "members": [],
        "additionalProps": [
          [
            [
              "string"
            ],
            {
              "kind": "primitive",
              "primitiveName": "string"
            }
          ]
        ],
        "typeName": "MetaHashIndex",
        "name": "MetaHashIndex"
      },
      "MetaResourceEntry": {
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
            "target",
            {
              "kind": "repeated",
              "min": null,
              "max": null,
              "repeated": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "target"
            }
          ],
          [
            "file",
            {
              "kind": "object",
              "members": [],
              "additionalProps": [
                [
                  [
                    "string"
                  ],
                  {
                    "kind": "primitive",
                    "primitiveName": "string"
                  }
                ]
              ],
              "name": "file"
            }
          ]
        ],
        "typeName": "MetaResourceEntry",
        "name": "MetaResourceEntry"
      },
      "MetaResourcesIndex": {
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
                "symlinkTargetName": "MetaResourceEntry",
                "typeName": "MetaResourceEntry",
                "name": "MetaResourceEntry"
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
                "symlinkTargetName": "MetaResourceEntry",
                "typeName": "MetaResourceEntry",
                "name": "MetaResourceEntry"
              },
              "name": "css"
            }
          ]
        ],
        "typeName": "MetaResourcesIndex",
        "name": "MetaResourcesIndex"
      },
      "ViewEntryBase": {
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
        "typeName": "ViewEntryBase",
        "name": "ViewEntryBase"
      },
      "ListViewEntry": {
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
            "symlinkTargetName": "ViewEntryBase",
            "typeName": "ViewEntryBase",
            "name": "ViewEntryBase"
          }
        ],
        "typeName": "ListViewEntry",
        "name": "ListViewEntry"
      },
      "CalendarViewEntry": {
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
            "symlinkTargetName": "ViewEntryBase",
            "typeName": "ViewEntryBase",
            "name": "ViewEntryBase"
          }
        ],
        "typeName": "CalendarViewEntry",
        "name": "CalendarViewEntry"
      },
      "CustomViewEntry": {
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
            "symlinkTargetName": "ViewEntryBase",
            "typeName": "ViewEntryBase",
            "name": "ViewEntryBase"
          }
        ],
        "typeName": "CustomViewEntry",
        "name": "CustomViewEntry"
      },
      "ViewEntry": {
        "kind": "one-of",
        "oneOf": [
          {
            "kind": "symlink",
            "symlinkTargetName": "ListViewEntry",
            "typeName": "ListViewEntry",
            "name": "ListViewEntry"
          },
          {
            "kind": "symlink",
            "symlinkTargetName": "CalendarViewEntry",
            "typeName": "CalendarViewEntry",
            "name": "CalendarViewEntry"
          },
          {
            "kind": "symlink",
            "symlinkTargetName": "CustomViewEntry",
            "typeName": "CustomViewEntry",
            "name": "CustomViewEntry"
          }
        ],
        "typeName": "ViewEntry",
        "name": "ViewEntry"
      },
      "MetaViewsIndex": {
        "kind": "object",
        "members": [],
        "additionalProps": [
          [
            [
              "string"
            ],
            {
              "kind": "object",
              "members": [
                [
                  "view",
                  {
                    "kind": "symlink",
                    "symlinkTargetName": "ViewEntry",
                    "typeName": "ViewEntry",
                    "name": "view"
                  }
                ]
              ],
              "additionalProps": [
                [
                  [
                    "string"
                  ],
                  {
                    "kind": "object",
                    "members": [
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
                      ]
                    ]
                  }
                ]
              ]
            }
          ]
        ],
        "typeName": "MetaViewsIndex",
        "name": "MetaViewsIndex"
      }
    }
  }
};
export default schema;
// tslint:enable: object-literal-key-quotes
