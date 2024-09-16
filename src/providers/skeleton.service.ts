import { Injectable } from '@angular/core';
import { avatar, avatarList, gap, list, listCard } from './iNavigation';
import { Dashboard, InitialInvestment, ManageUser, User } from './constants';

@Injectable({
  providedIn: 'root'
})
export class SkeletonService {

  constructor() { }

  getPageMatrix(pageName: string) {
    switch (pageName) {
      case Dashboard:
        return this.getDahboardMatrix();
      case User:
        return this.getTableMatrix();
      case ManageUser:
      case InitialInvestment:
        return this.getEditFormMatrix();
      default:
        return this.getDefaultMatrix();
    }
  }

  private getDahboardMatrix() {
    return [
      {
        d: [
          {
            c: ['d-flex', 'my-2', 'mb-5'],
            s: '-,25,4',
            r: 4,
          },
          {
            c: ['d-flex', 'col-12'],
            d: [
              {
                c: ['col-6'],
                d: [
                  avatarList(2, 20),
                  gap(5),
                  ...listCard({
                    startWidth: 35,
                    lineCount: 5,
                    isForwardDirection: false,
                    cardHeight: 20,
                  })
                ],
              },
              {
                c: ['col-6'],
                d: [
                  ...listCard({
                    startWidth: 10,
                    lineCount: 2,
                  }),
                  gap(5),
                  ...listCard({
                    startWidth: 10,
                    lineCount: 2,
                  }),
                  gap(5),
                  ...listCard({
                    startWidth: 10,
                    lineCount: 2,
                  }),
                ],
              },
            ],
          },
        ],
      }
    ];
  }

  private getDefaultMatrix() {
    return [
      {
        d: [
          {
            c: ["d-flex", "justify-content-between", "col-12"],
            d: [
              {
                c: ["col-8", "d-flex"],
                d: [
                  ...list({
                    lineCount: 3,
                    height: 3,
                    width: 9
                  })
                ]
              },
              {
                c: ["col-4", "d-flex"],
                d: [
                  ...list({
                    lineCount: 3,
                    height: 3,
                    width: 8.6
                  })
                ]
              },
            ]
          },
          {
            d: [
              gap(3)
            ]
          },
          {
            c: ['d-flex', 'col-12'],
            d: [
              {
                c: ['col-6'],
                d: [
                  ...listCard({
                    startWidth: 10,
                    lineCount: 2,
                  }),
                ],
              },
              {
                c: ['col-6'],
                d: [
                  ...listCard({
                    startWidth: 10,
                    lineCount: 2,
                  }),
                ],
              },
            ],
          },
          {
            d: [
              gap(5),
              ...list({
                lineCount: 7,
                height: 2
              })
            ]
          }
        ],
      }
    ];
  }

  private getTableMatrix() {
    return [
      {
        d: [
          {
            c: ["d-flex", "justify-content-between", "col-12"],
            d: [
              {
                c: ["col-8", "d-flex"],
                d: [
                  ...list({
                    lineCount: 3,
                    height: 3,
                    width: 9
                  })
                ]
              },
              {
                c: ["col-4", "d-flex"],
                d: [
                  ...list({
                    lineCount: 3,
                    height: 3,
                    width: 8.6
                  })
                ]
              },
            ]
          },
          {
            d: [
              gap(3),
            ]
          },
          {
            c: ["d-flex", "justify-content-between"],
            d: [
              ...list({
                lineCount: 5,
                height: 2,
                width: 15.5
              })
            ]
          },
          {
            d: [
              gap(1),
              ...list({
                lineCount: 10,
                height: 2
              })
            ]
          },
          {
            d: [
              gap(1),
              ...list({
                lineCount: 1,
                height: 1.5
              })
            ]
          }
        ],
      }
    ];
  }

  private getEditFormMatrix() {
    return [
      {
        d: [
          {
            c: ["d-flex", "justify-content-between", "col-12"],
            d: [
              {
                c: ["col-8", "d-flex"],
                d: [
                  ...list({
                    lineCount: 3,
                    height: 3,
                    width: 12
                  })
                ]
              },
            ]
          },
          {
            d: [
              gap(4),
            ]
          },
          {
            c: ["d-flex", "justify-content-between"],
            d: [
              ...list({
                lineCount: 5,
                height: 2,
                width: 15.5
              })
            ]
          },
          {
            d: [
              gap(3),
            ]
          },
          {
            c: ["d-flex", "justify-content-between"],
            d: [
              ...list({
                lineCount: 5,
                height: 2,
                width: 15.5
              })
            ]
          },
          {
            d: [
              gap(3),
            ]
          },
          {
            c: ["d-flex", "justify-content-between"],
            d: [
              ...list({
                lineCount: 5,
                height: 2,
                width: 15.5
              })
            ]
          },
          {
            d: [
              gap(3),
            ]
          },
          {
            c: ["d-flex", "justify-content-between"],
            d: [
              ...list({
                lineCount: 5,
                height: 2,
                width: 15.5
              })
            ]
          },
          {
            d: [
              gap(3),
            ]
          },
          {
            c: ["d-flex", "justify-content-between"],
            d: [
              ...list({
                lineCount: 5,
                height: 2,
                width: 15.5
              })
            ]
          },
          {
            d: [
              gap(3),
            ]
          },
          {
            c: ["d-flex", "justify-content-between"],
            d: [
              ...list({
                lineCount: 5,
                height: 2,
                width: 15.5
              })
            ]
          },
          {
            d: [
              gap(2)
            ]
          },
          {
            c: ["d-flex", "justify-content-end"],
            d: [
              ...list({
                lineCount: 2,
                height: 2,
                width: 5
              })
            ]
          }
        ],
      }
    ];
  }

  private getEmpDeclarationListMatrix() {
    return [
      {
        d: [
          {
            c: ["d-flex", "justify-content-between", "col-12"],
            d: [
              {
                c: ["col-8", "d-flex"],
                d: [
                  ...list({
                    lineCount: 3,
                    height: 3,
                    width: 9
                  })
                ]
              },
              {
                c: ["col-4", "d-flex"],
                d: [
                  ...list({
                    lineCount: 3,
                    height: 3,
                    width: 8.6
                  })
                ]
              },
            ]
          },
          {
            d: [
              gap(3),
            ]
          },
          {
            c: ["d-flex", "justify-content-between"],
            d: [
              ...list({
                lineCount: 12,
                height: 5,
                width: 5
              })
            ]
          },
          {
            d: [
              gap(1),
              ...list({
                lineCount: 10,
                height: 2
              })
            ]
          },
          {
            d: [
              gap(1),
              ...list({
                lineCount: 1,
                height: 1.5
              })
            ]
          }
        ],
      }
    ];
  }

  private getProcessingPayrollMatrix() {
    return [
      {
        d: [
          {
            c: ["d-flex", "justify-content-between", "col-12"],
            d: [
              {
                c: ["col-8", "d-flex"],
                d: [
                  ...list({
                    lineCount: 3,
                    height: 3,
                    width: 9
                  })
                ]
              },
              {
                c: ["col-4", "d-flex"],
                d: [
                  ...list({
                    lineCount: 3,
                    height: 3,
                    width: 8.6
                  })
                ]
              },
            ]
          },
          {
            d: [
              gap(3),
            ]
          },
          {
            c: ["d-flex", "justify-content-end"],
            d: [
              ...list({
                lineCount: 2,
                height: 2,
                width: 8
              })
            ]
          },
          {
            d: [
              gap(3),
            ]
          },
          {
            d: [
              ...list({
                lineCount: 1,
                width: 15,
                gapSize: 0
              })
            ]
          },
          {
            d: [
              ...list({
                lineCount: 1,
                height: 5,
              })
            ]
          },
          {
            d: [
              gap(3)
            ]
          },
          {
            d: [
              ...list({
                lineCount: 1,
                width: 15
              })
            ]
          },
          {
            d: [
              ...list({
                lineCount: 1,
                height: 5
              })
            ]
          },
          {
            d: [
              gap(3)
            ]
          },
          {
            d: [
              ...list({
                lineCount: 1,
                width: 15
              })
            ]
          },
          {
            d: [
              ...list({
                lineCount: 1,
                height: 5
              })
            ]
          },
        ],
      }
    ];
  }

  private getProfileMatrix() {
    return [
      {
        d: [
          {
            c: ["d-flex", "justify-content-between", "col-12"],
            d: [
              {
                c: ["col-8", "d-flex"],
                d: [
                  ...list({
                    lineCount: 3,
                    height: 3,
                    width: 9
                  })
                ]
              }
            ]
          },
          {
            d: [
              gap(3),
            ]
          },
          {
            c: ["d-flex", "justify-content-between", "col-12"],
            d: [
              {
                c: ["col-12", "d-flex"],
                d: [
                  ...list({
                    lineCount: 9,
                    height: 2,
                    width: 6
                  })
                ]
              }
            ]
          },
          {
            d: [
              gap(3)
            ]
          },
          {
            c: ["d-flex", "justify-content-end"],
            d: [
              ...list({
                lineCount: 1,
                height: 2,
                width: 4
              })
            ]
          },
          {
            d: [
              gap(3),
            ]
          },
          {
            c: ["d-flex", "justify-content-between", "col-12", "align-items-center"],
            d: [
              {
                c: ["col-4", "d-flex", "align-items-center", "justify-content-center"],
                d: [
                  avatar({
                    radius: 9
                  })
                ]
              },
              {
                c: ["col-8"],
                d: [
                  ...list({
                    lineCount: 3,
                    height: 3,
                  })
                ]
              }
            ]
          },
          {
            d: [
              gap(3)
            ]
          },
          {
            d: [
              ...list({
                lineCount: 1,
                height: 3
              })
            ]
          },
          {
            d: [
              ...list({
                lineCount: 1,
                height: 9,
              })
            ]
          }
        ],
      }
    ];
  }

  private getApplyLeaveMatrix() {
    return [
      {
        d: [
          {
            c: ["d-flex", "justify-content-between", "col-12"],
            d: [
              {
                c: ["col-8", "d-flex"],
                d: [
                  ...list({
                    lineCount: 3,
                    height: 3,
                    width: 9
                  })
                ]
              }
            ]
          },
          {
            d: [
              gap(3)
            ]
          },
          {
            c: ["d-flex", "justify-content-between", "col-12"],
            d: [
              {
                c: ["col-8"],
                d: [
                  ...list({
                    lineCount: 1,
                    height: 5,
                  })
                ]
              },
              {
                c: ["col-4", ],
                d: [
                  ...list({
                    lineCount: 1,
                    height: 5,
                  })
                ]
              }
            ]
          },
          {
            d: [
              gap(1),
            ]
          },
          {
            c: ["d-flex", "justify-content-between", "col-12"],
            d: [
              {
                c: ["col-4"],
                d: [
                  ...list({
                    lineCount: 1,
                    height: 15,
                  })
                ]
              },
              {
                c: ["col-4"],
                d: [
                  ...list({
                    lineCount: 1,
                    height: 15,
                  })
                ]
              },
              {
                c: ["col-4"],
                d: [
                  ...list({
                    lineCount: 1,
                    height: 15,
                  })
                ]
              },
            ]
          },
          {
            d: [
              gap(1),
            ]
          },
          {
            c: ["d-flex", "justify-content-between", "col-12"],
            d: [
              {
                c: ["col-4"],
                d: [
                  ...list({
                    lineCount: 1,
                    height: 15,
                  })
                ]
              },
              {
                c: ["col-4"],
                d: [
                  ...list({
                    lineCount: 1,
                    height: 15,
                  })
                ]
              },
              {
                c: ["col-4"],
                d: [
                  ...list({
                    lineCount: 1,
                    height: 15,
                  })
                ]
              },
            ]
          }
        ],
      }
    ];
  }

  private getApprovalRequestMatrix() {
    return [
      {
        d: [
          {
            c: ["d-flex", "justify-content-between", "col-12"],
            d: [
              {
                c: ["col-8", "d-flex"],
                d: [
                  ...list({
                    lineCount: 3,
                    height: 3,
                    width: 9
                  })
                ]
              }
            ]
          },
          {
            d: [
              gap(3)
            ]
          },
          {
            c: ["d-flex", "justify-content-between", "col-12"],
            d: [
              {
                c: ["col-12", "d-flex"],
                d: [
                  ...list({
                    lineCount: 5,
                    height: 2,
                    width: 5
                  })
                ]
              }
            ]
          },
          {
            d: [
              gap(1)
            ]
          },
          {
            c: ["d-flex", "justify-content-between", "col-12"],
            d: [
              {
                c: ["col-12", "d-flex"],
                d: [
                  ...list({
                    lineCount: 4,
                    height: 2,
                    width: 15
                  })
                ]
              }
            ]
          },
          {
            d: [
              {
                c: ["col-12", "mt-3"],
                d: [
                  ...list({
                    lineCount: 1,
                    height: 5,
                  })
                ]
              }
            ]
          },
          {
            d: [
              {
                c: ["col-12", "mt-3"],
                d: [
                  ...list({
                    lineCount: 1,
                    height: 5,
                  })
                ]
              }
            ]
          },
          {
            d: [
              {
                c: ["col-12", "mt-3"],
                d: [
                  ...list({
                    lineCount: 1,
                    height: 5,
                  })
                ]
              }
            ]
          },
          {
            d: [
              {
                c: ["col-12", "mt-3"],
                d: [
                  ...list({
                    lineCount: 1,
                    height: 5,
                  })
                ]
              }
            ]
          }
        ],
      }
    ];
  }

  private getConfigPayrollMatrix() {
    return [
      {
        d: [
          {
            c: ["d-flex", "justify-content-between", "col-12"],
            d: [
              {
                c: ["col-8", "d-flex"],
                d: [
                  ...list({
                    lineCount: 3,
                    height: 3,
                    width: 9
                  })
                ]
              }
            ]
          },
          {
            d: [
              gap(3)
            ]
          },
          {
            c: ["d-flex", "justify-content-between", "col-12"],
            d: [
              {
                c: ["col-12", "d-flex"],
                d: [
                  ...list({
                    lineCount: 5,
                    height: 3,
                    width: 16
                  })
                ]
              }
            ]
          },
          {
            c: ["d-flex", "justify-content-between", "col-12", "mt-4"],
            d: [
              {
                c: ["col-8", "d-flex"],
                d: [
                  ...list({
                    lineCount: 3,
                    height: 2,
                    width: 5
                  })
                ]
              },
              {
                c: ["col-3", "d-flex", "justify-content-end"],
                d: [
                  ...list({
                    lineCount: 2,
                    height: 2,
                    width: 5
                  })
                ]
              }
            ]
          },
          {
            d: [
              gap(1)
            ]
          },
          {
            d: [
              {
                c: ["col-12", "mt-3"],
                d: [
                  ...list({
                    lineCount: 7,
                    height: 3,
                  })
                ]
              }
            ]
          }
        ],
      }
    ];
  }

  private getDeclarationMatrix() {
    return [
      {
        d: [
          {
            c: ["d-flex", "justify-content-between", "col-12"],
            d: [
              {
                c: ["col-8", "d-flex"],
                d: [
                  ...list({
                    lineCount: 3,
                    height: 3,
                    width: 9
                  })
                ]
              },
              {
                c: ["col-4", "d-flex", "justify-content-end"],
                d: [
                  ...list({
                    lineCount: 2,
                    height: 3,
                    width: 9
                  })
                ]
              }
            ]
          },
          {
            d: [
              gap(3)
            ]
          },
          {
            d: [
              {
                c: ["col-12", "mt-3"],
                d: [
                  ...list({
                    lineCount: 1,
                    height: 6,
                  })
                ]
              }
            ]
          },
          {
            d: [
              {
                c: ["col-12", "mt-3"],
                d: [
                  ...list({
                    lineCount: 1,
                    height: 3,
                  })
                ]
              }
            ]
          },
          {
            d: [
              {
                c: ["col-12", "mt-3"],
                d: [
                  ...list({
                    lineCount: 1,
                    height: 5,
                  })
                ]
              }
            ]
          },
          {
            d: [
              {
                c: ["col-12", "mt-3"],
                d: [
                  ...list({
                    lineCount: 1,
                    height: 6,
                  })
                ]
              }
            ]
          },
          {
            d: [
              {
                c: ["col-12", "mt-2"],
                d: [
                  ...list({
                    lineCount: 3,
                    height: 2,
                  })
                ]
              }
            ]
          }
        ],
      }
    ];
  }

  private getIncomeTaxMatrix() {
    return [
      {
        d: [
          {
            c: ["d-flex", "justify-content-between", "col-12"],
            d: [
              {
                c: ["col-8", "d-flex"],
                d: [
                  ...list({
                    lineCount: 3,
                    height: 3,
                    width: 9
                  })
                ]
              },
              {
                c: ["col-4", "d-flex", "justify-content-end"],
                d: [
                  ...list({
                    lineCount: 1,
                    height: 3,
                    width: 9
                  })
                ]
              }
            ]
          },
          {
            d: [
              gap(3)
            ]
          },
          {
            d: [
              {
                c: ["col-12", "mt-3"],
                d: [
                  ...list({
                    lineCount: 1,
                    height: 5,
                  })
                ]
              }
            ]
          },
          {
            d: [
              {
                c: ["col-12", "mt-3"],
                d: [
                  ...list({
                    lineCount: 1,
                    height: 7,
                  })
                ]
              }
            ]
          },
          {
            d: [
              {
                c: ["col-12", "mt-3", "d-flex", "justify-content-between"],
                d: [
                  ...list({
                    lineCount: 6,
                    height: 5,
                    width: 12
                  })
                ]
              }
            ]
          },
          {
            d: [
              {
                c: ["col-12", "mt-2"],
                d: [
                  ...list({
                    lineCount: 6,
                    height: 2,
                  })
                ]
              }
            ]
          }
        ],
      }
    ];
  }

  private getSalaryMatrix() {
    return [
      {
        d: [
          {
            d: [
              {
                c: ["col-12", "d-flex"],
                d: [
                  ...list({
                    lineCount: 3,
                    height: 2,
                    width: 10
                  })
                ]
              }
            ]
          },
          {
            c: ["d-flex", "justify-content-between", "col-12", "mt-3"],
            d: [
              {
                c: ["col-8", "d-flex"],
                d: [
                  ...list({
                    lineCount: 3,
                    height: 3,
                    width: 12
                  })
                ]
              }
            ]
          },
          {
            d: [
              gap(3)
            ]
          },
          {
            c: ["d-flex", "justify-content-between", "col-12"],
            d: [
              {
                c: ["col-12", "d-flex"],
                d: [
                  ...list({
                    lineCount: 3,
                    height: 2,
                    width: 10
                  })
                ]
              }
            ]
          },
          {
            c: ["d-flex", "justify-content-between", "col-12", "align-items-center", "mt-5"],
            d: [
              {
                c: ["col-3", "d-flex", "justify-content-center"],
                d: [
                  avatar({
                    radius: 10
                  })
                ]
              },
              {
                c: ["col-9"],
                d: [
                  ...list({
                    lineCount: 3,
                    height: 3,
                  })
                ]
              }
            ]
          },
          {
            d: [
              {
                c: ["col-12", "mt-3"],
                d: [
                  ...list({
                    lineCount: 4,
                    height: 2,
                  })
                ]
              }
            ]
          }
        ],
      }
    ];
  }

  private getPayslipMatrix() {
    return [
      {
        d: [
          {
            d: [
              {
                c: ["col-12", "d-flex"],
                d: [
                  ...list({
                    lineCount: 3,
                    height: 2,
                    width: 10
                  })
                ]
              }
            ]
          },
          {
            c: ["d-flex", "justify-content-between", "col-12", "mt-3"],
            d: [
              {
                c: ["col-8", "d-flex"],
                d: [
                  ...list({
                    lineCount: 3,
                    height: 3,
                    width: 12
                  })
                ]
              }
            ]
          },
          {
            d: [
              gap(3)
            ]
          },
          {
            d: [
              {
                c: ["col-12", "d-flex"],
                d: [
                  ...list({
                    lineCount: 3,
                    height: 2,
                    width: 8
                  })
                ]
              }
            ]
          },
          {
            c: ["d-flex", "justify-content-between", "col-12", "align-items-center", "mt-5"],
            d: [
              {
                c: ["col-2"],
                d: [
                  ...list({
                    lineCount: 8,
                    height: 3,
                  })
                ]
              },
              {
                c: ["col-10"],
                d: [
                  ...list({
                    lineCount: 8,
                    height: 3,
                  })
                ]
              }
            ]
          }
        ],
      }
    ];
  }

  private getPayrollSettingMatrix() {
    return [
      {
        d: [
          {
            d: [
              {
                c: ["col-12", "d-flex"],
                d: [
                  ...list({
                    lineCount: 3,
                    height: 3,
                    width: 10
                  })
                ]
              }
            ]
          },
          {
            d: [
              {
                c: ["mt-4"],
                d: [
                  ...list({
                    lineCount: 1,
                    height: 3,
                  })
                ]
              }
            ]
          },
          {
            d: [
              {
                d: [
                  ...list({
                    lineCount: 1,
                    height: 2,
                  })
                ]
              }
            ]
          },
          {
            c: ["d-flex"],
            d: [
              {
                c: ["col-6", "d-flex", "justify-content-end"],
                d: [
                  ...list({
                    lineCount: 1,
                    height: 12,
                    width: 20
                  })
                ]
              },
              {
                c: ["col-6", "d-flex"],
                d: [
                  ...list({
                    lineCount: 1,
                    height: 12,
                    width: 20
                  })
                ]
              }
            ]
          },
          {
            c: ["d-flex", "mt-4"],
            d: [
              {
                c: ["col-6", "d-flex", "justify-content-end"],
                d: [
                  ...list({
                    lineCount: 1,
                    height: 12,
                    width: 20
                  })
                ]
              },
              {
                c: ["col-6", "d-flex"],
                d: [
                  ...list({
                    lineCount: 1,
                    height: 12,
                    width: 20
                  })
                ]
              }
            ]
          },
        ],
      }
    ];
  }

  private getPayrollMatrix() {
    return [
      {
        d: [
          {
            d: [
              {
                c: ["col-12", "d-flex"],
                d: [
                  ...list({
                    lineCount: 3,
                    height: 3,
                    width: 10
                  })
                ]
              }
            ]
          },
          {
            d: [
              {
                c: ["mt-4"],
                d: [
                  ...list({
                    lineCount: 1,
                    height: 2,
                  })
                ]
              }
            ]
          },
          {
            d: [
              {
                c: ["mt-3"],
                d: [
                  ...list({
                    lineCount: 1,
                    height: 12,
                  })
                ]
              },
            ]
          },
          {
            d: [
              {
                c: ["mt-3"],
                d: [
                  ...list({
                    lineCount: 1,
                    height: 12,
                  })
                ]
              },
            ]
          },
        ],
      }
    ];
  }

  private getPfEsiMatrix() {
    return [
      {
        d: [
          {
            d: [
              {
                c: ["col-12", "d-flex"],
                d: [
                  ...list({
                    lineCount: 3,
                    height: 3,
                    width: 10
                  })
                ]
              }
            ]
          },
          {
            d: [
              {
                c: ["mt-4"],
                d: [
                  ...list({
                    lineCount: 1,
                    height: 2,
                  })
                ]
              }
            ]
          },
          {
            c: ["d-flex", "justify-content-between"],
            d: [
              {
                c: ["mt-3", "col-6"],
                d: [
                  ...list({
                    lineCount: 1,
                    height: 18,
                  })
                ]
              },
              {
                c: ["mt-3", "col-6"],
                d: [
                  ...list({
                    lineCount: 1,
                    height: 18,
                  })
                ]
              }
            ]
          }
        ],
      }
    ];
  }

  private getDocumentMatrix() {
    return [
      {
        d: [
          {
            d: [
              {
                c: ["col-12", "d-flex"],
                d: [
                  ...list({
                    lineCount: 3,
                    height: 3,
                    width: 10
                  })
                ]
              }
            ]
          },
          {
            c: ["mt-3"],
            d: [
              {
                c: ["col-12", "d-flex", "justify-content-between"],
                d: [
                  ...list({
                    lineCount: 5,
                    height: 10,
                    width: 15
                  })
                ]
              }
            ]
          },
          {
            c: ["mt-3"],
            d: [
              {
                c: ["col-12", "d-flex", "justify-content-between"],
                d: [
                  ...list({
                    lineCount: 5,
                    height: 10,
                    width: 15
                  })
                ]
              }
            ]
          },
          {
            c: ["mt-3"],
            d: [
              {
                c: ["col-12", "d-flex", "justify-content-between"],
                d: [
                  ...list({
                    lineCount: 5,
                    height: 10,
                    width: 15
                  })
                ]
              }
            ]
          },
        ],
      }
    ];
  }
}
